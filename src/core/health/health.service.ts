import { Injectable, Logger } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CloudWatchService } from '@/common/aws/cloudwatch/cloudwatch.service';

/**
 * Serviço responsável por verificar a saúde do servidor.
 *
 * @class
 */
@Injectable()
export class HealthService {
  /**
   * Construtor do serviço de saúde.
   * @param db Indicador de saúde do TypeORM.
   * @param prisma Indicador de saúde do Prisma.
   * @param prismaService Serviço do Prisma.
   * @param disk Indicador de saúde do disco.
   * @param memory Indicador de saúde da memória.
   */
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly cloudWatchService: CloudWatchService,
  ) {}

  /**
   * Logger instance for monitoring server health.
   *
   * This logger is used to log messages related to the health of the server.
   * It helps in tracking the server's status and identifying any potential issues.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger('Server Health');

  /**
   * Verifica a saúde do servidor.
   * @returns Um objeto contendo o resultado da verificação de saúde.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkHealth() {
    try {
      const serverHealth: HealthCheckResult = await this.health.check([
        () => this.http.pingCheck('nestjs-api', process.env.ENVIRONMENT_URL),
        () => this.prisma.pingCheck('prisma', this.prismaService),
        () =>
          this.disk.checkStorage('storage', {
            path: `/var/lib/postgresql/data`,
            thresholdPercent: 7.0,
          }),
        () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),
      ]);

      if (serverHealth.status === 'ok') {
        this.logger.log('All services are up and running! 🌱');
      }

      return serverHealth;
    } catch (error) {
      const errorLog = {
        statusCode: `${error.response.status} ${error.status}`,
        message: error.message,
        details: error.response.details,
      };

      await this.cloudWatchService.logError(
        process.env.CLOUDWATCH_LOG_GROUP,
        process.env.CLOUDWATCH_LOG_STREAM,
        errorLog,
      );

      this.logger.error(`Error checking health: ${JSON.stringify(errorLog)}`);
      throw error;
    }
  }
}

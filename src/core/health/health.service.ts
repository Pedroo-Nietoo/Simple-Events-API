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

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}
  private readonly logger = new Logger('Server Health');

  async checkHealth() {
    try {
      const serverHealth: HealthCheckResult = await this.health.check([
        () =>
          this.http.pingCheck('nestjs-api', 'http://localhost:3000/api-docs'),
        () => this.prisma.pingCheck('prisma', this.prismaService),
        // () => this.db.pingCheck('database'),
        // () =>
        //   this.disk.checkStorage('storage', {
        //     path: `C:/Program Files/PostgreSQL/data`,
        //     thresholdPercent: 1.0,
        //   }),
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
      this.logger.error(`Error checking health: ${JSON.stringify(errorLog)}`);
      throw error;
    }
  }
}

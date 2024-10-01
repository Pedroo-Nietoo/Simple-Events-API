import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { CloudWatchService } from '@/common/aws/cloudwatch/cloudwatch.service';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [HealthService, PrismaService, CloudWatchService],
})
export class HealthModule {}

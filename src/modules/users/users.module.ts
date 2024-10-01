import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from '@/common/aws/s3/s3.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, S3Service],
})
export class UsersModule {}

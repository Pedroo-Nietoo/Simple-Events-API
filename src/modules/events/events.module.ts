import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { PrismaService } from '@prisma/prisma.service';
import { QrCodeController } from './controllers/qr-code.controller';
import { QrCodeService } from './services/qr-code.service';

@Module({
  controllers: [EventsController, QrCodeController],
  providers: [EventsService, QrCodeService, PrismaService],
})
export class EventsModule {}

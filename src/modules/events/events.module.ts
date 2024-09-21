import { MailService } from '@/common/mail/mail.service';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '@prisma/prisma.service';
import { QrCodeController } from '../../common/qr-code/qr-code.controller';
import { QrCodeService } from '../../common/qr-code/qr-code.service';
import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController, QrCodeController],
  providers: [EventsService, QrCodeService, MailService, PrismaService],
})
export class EventsModule {}

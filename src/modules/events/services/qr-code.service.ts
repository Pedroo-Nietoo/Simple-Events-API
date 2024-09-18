import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class QrCodeService {
  constructor(private prisma: PrismaService) {}

  async getBadge(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existingCheckIn = await this.prisma.checkIn.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });

    if (!existingCheckIn) {
      throw new NotFoundException('User is not registered in this event');
    }

    const url = `http://localhost:3000/events/${eventId}/attendee/${userId}/check-in`;
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url);
      return qrCodeDataURL;
    } catch (err) {
      console.error('Error generating QR Code', err);
      throw err;
    }
  }

  async checkIn(eventId: string, userId: string) {
    const existingRegistration = await this.prisma.checkIn.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });

    if (!existingRegistration) {
      throw new NotFoundException('User is not registered in this event');
    }

    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });

    if (checkIn.checkedIn === true) {
      throw new ConflictException('User already checked in for this event');
    }

    await this.prisma.checkIn.update({
      where: { id: checkIn.id },

      data: {
        eventId: eventId,
        userId: userId,
        checkedIn: true,
      },
    });

    return { message: 'Check-in successful' };
  }
}

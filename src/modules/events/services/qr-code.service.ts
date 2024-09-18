import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Service class for managing QR codes related to event check-ins.
 */
@Injectable()
export class QrCodeService {
  /**
   * Constructs an instance of the QrCodeService.
   *
   * @param {PrismaService} prisma - The Prisma service used for database operations.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a QR code for an attendee to check in to an event.
   * @param eventId - The ID of the event.
   * @param userId - The ID of the user.
   * @returns A Data URL representing the QR code.
   * @throws NotFoundException if the event or the user's check-in is not found.
   * @throws Error if there is an issue generating the QR code.
   */
  async getBadge(eventId: string, userId: string): Promise<string> {
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
      throw new Error('Error generating QR Code');
    }
  }

  /**
   * Checks in a user to an event.
   * @param eventId - The ID of the event.
   * @param userId - The ID of the user.
   * @returns A message indicating the result of the check-in.
   * @throws NotFoundException if the user is not registered in the event.
   * @throws ConflictException if the user has already checked in.
   */
  async checkIn(eventId: string, userId: string): Promise<{ message: string }> {
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
        checkedIn: true,
      },
    });

    return { message: 'Check-in successful' };
  }
}

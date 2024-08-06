import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { generateSlug } from '@/utils/generate-slug.util';
import { Event } from './entities/event.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const slug = generateSlug(createEventDto.title);

    const event = await this.prisma.event.findFirst({
      where: {
        slug,
      },
    });

    if (event) {
      throw new ConflictException(
        `Event with title '${createEventDto.title}' already exists`,
      );
    }

    createEventDto.slug = slug;

    return await this.prisma.event.create({
      data: {
        ...createEventDto,
        slug,
        dateStart: new Date(createEventDto.dateStart),
        dateEnd: new Date(createEventDto.dateEnd),
      },
    });
  }

  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        checkIns: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (events.length === 0) {
      throw new NotFoundException('No events found');
    }

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        checkIns: {
          select: {
            user: true,
            userId: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    const slug = generateSlug(updateEventDto.title);

    const eventWithSlug = await this.prisma.event.findUnique({
      where: {
        slug,
      },
    });

    if (eventWithSlug && eventWithSlug.id !== id) {
      throw new ConflictException(
        `Event with title '${updateEventDto.title}' already exists`,
      );
    }

    const updatedData = {
      ...event,
      ...updateEventDto,
      dateStart: new Date(updateEventDto.dateStart),
      dateEnd: new Date(updateEventDto.dateEnd),
    };

    return await this.prisma.event.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    await this.prisma.event.delete({
      where: { id },
    });
  }

  async registerUserInEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { maximumAttendees: true, ageRestricted: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const checkIns = await this.prisma.checkIn.count({
      where: { eventId: eventId },
    });

    if (event.maximumAttendees && checkIns >= event.maximumAttendees) {
      throw new ConflictException('Event is full');
    }

    if (event.ageRestricted) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { birthDate: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const age = new Date().getFullYear() - user.birthDate.getFullYear();
      if (age < 18) {
        throw new ConflictException('Cannot register: Age restriction');
      }
    }

    const existingCheckIn = await this.prisma.checkIn.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });

    if (existingCheckIn) {
      throw new ConflictException('User already registered in this event');
    }

    await this.prisma.checkIn.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });

    return { message: 'Registration successful' };
  }

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

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { generateSlug } from '@utils/generate-slug.util';
import { Event } from './entities/event.entity';
import { PrismaService } from '@prisma/prisma.service';
import { MailService } from '@/common/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Service class for managing events.
 *
 * @class
 */
@Injectable()
export class EventsService {
  /**
   * Constructs an instance of the EventsService.
   *
   * @param {PrismaService} prisma - The Prisma service used for database operations.
   */
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  /**
   * Creates a new event.
   * @param createEventDto - Data transfer object for event creation.
   * @returns The created event.
   * @throws ConflictException if an event with the same title already exists.
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const slug = generateSlug(createEventDto.title);

    const existingEvent = await this.prisma.event.findFirst({
      where: { slug },
    });

    if (existingEvent) {
      throw new ConflictException(
        `Event with title '${createEventDto.title}' already exists`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createEventDto.eventCreatorId },
    });

    if (!user) {
      throw new NotFoundException('Event creator not found');
    }

    return await this.prisma.event.create({
      data: {
        ...createEventDto,
        slug,
        eventCreatorId: createEventDto.eventCreatorId,
        dateStart: new Date(createEventDto.dateStart),
        dateEnd: new Date(createEventDto.dateEnd),
      },
    });
  }

  /**
   * Retrieves all events.
   * @returns An array of events.
   * @throws NotFoundException if no events are found.
   */
  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        eventCreator: {
          select: {
            id: true,
            email: true,
          },
        },
        checkIns: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                birthDate: true,
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

  /**
   * Retrieves a specific event by its ID.
   * @param id - The ID of the event to retrieve.
   * @returns The event with the given ID.
   * @throws NotFoundException if the event is not found.
   */
  async findOne(slug: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        eventCreator: {
          select: {
            id: true,
            email: true,
          },
        },
        checkIns: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                birthDate: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  /**
   * Updates an existing event.
   * @param id - The ID of the event to update.
   * @param updateEventDto - Data transfer object for event update.
   * @returns The updated event.
   * @throws NotFoundException if the event is not found.
   * @throws ConflictException if an event with the same title already exists.
   */
  async update(slug: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.eventCreatorId !== updateEventDto.eventCreatorId) {
      throw new UnauthorizedException('User is not authorized to update event');
    }

    const eventSlug = generateSlug(updateEventDto.title);

    const eventWithSlug = await this.prisma.event.findUnique({
      where: { slug: eventSlug },
    });

    if (eventWithSlug && eventWithSlug.slug !== slug) {
      throw new ConflictException(
        `Event with title '${updateEventDto.title}' already exists`,
      );
    }

    return await this.prisma.event.update({
      where: { slug },
      data: {
        ...updateEventDto,
        dateStart: new Date(updateEventDto.dateStart),
        dateEnd: new Date(updateEventDto.dateEnd),
      },
    });
  }

  /**
   * Deletes an event by its ID.
   * @param id - The ID of the event to delete.
   * @throws NotFoundException if the event is not found.
   */
  async remove(slug: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: { checkIns: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.checkIn.deleteMany({
      where: { eventId: event.id },
    });

    await this.prisma.event.delete({
      where: { slug },
    });
  }

  /**
   * Registers a user for an event.
   * @param eventId - The ID of the event to register for.
   * @param userId - The ID of the user to register.
   * @param eventCreatorId - The ID of the user who created the event.
   * @returns A message indicating the result of the registration.
   * @throws NotFoundException if the event or user is not found.
   * @throws ConflictException if the event is full or the user is already registered.
   */
  async registerUserInEvent(
    eventSlug: string,
    userId: string,
  ): Promise<{ message: string }> {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const event = await prisma.event.findUnique({
        where: { slug: eventSlug },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const checkIns = await prisma.checkIn.count({
        where: { eventId: event.id },
      });

      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getUTCMonth(),
        today.getDate(),
      );

      const eventEndDate = new Date(
        event.dateEnd.getFullYear(),
        event.dateEnd.getUTCMonth(),
        event.dateEnd.getUTCDate(),
      );

      if (todayDate > eventEndDate) {
        throw new ConflictException('Cannot register: Event has already ended');
      }

      if (event.maximumAttendees && checkIns >= event.maximumAttendees) {
        throw new ConflictException('Event is full');
      }

      if (event.ageRestricted) {
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const age = new Date().getFullYear() - user.birthDate.getFullYear();
        if (age < 18) {
          throw new ConflictException('Cannot register: Age restriction');
        }
      }

      const existingCheckIn = await prisma.checkIn.findUnique({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId,
          },
        },
      });

      if (existingCheckIn) {
        throw new ConflictException('User already registered in this event');
      }

      await prisma.checkIn.create({
        data: {
          eventId: event.id,
          userId,
        },
      });

      await this.mailService.sendRegistrationEmail(user, event);

      return { message: 'Registration successful' };
    });
  }

  /**
   * Removes past events from the database.
   *
   * This method performs the following steps:
   * 1. Finds all events that have ended before yesterday.
   * 2. For each of these past events, checks if the event ended more than 30 days ago.
   * 3. If the event ended more than 30 days ago, deletes all associated check-ins.
   * 4. Deletes the event itself from the database.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removePastEvents(): Promise<void> {
    const pastEvents = await this.prisma.event.findMany({
      where: {
        dateEnd: {
          lt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    });

    for (const event of pastEvents) {
      if (
        new Date(event.dateEnd).getTime() <
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
      ) {
        await this.prisma.checkIn.deleteMany({
          where: { eventId: event.id },
        });

        await this.prisma.event.delete({
          where: { id: event.id },
        });
      }
    }
  }
}

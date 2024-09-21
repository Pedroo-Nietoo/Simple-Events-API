import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { generateSlug } from '@utils/generate-slug.util';
import { Event } from './entities/event.entity';
import { PrismaService } from '@prisma/prisma.service';
import { MailService } from '@/common/mail/mail.service';

/**
 * Service class for managing events.
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

    return await this.prisma.event.create({
      data: {
        ...createEventDto,
        slug,
        dateStart: new Date(createEventDto.dateStart),
        dateEnd: new Date(createEventDto.dateEnd),
        startTime: new Date(createEventDto.startTime),
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

  /**
   * Retrieves a specific event by its ID.
   * @param id - The ID of the event to retrieve.
   * @returns The event with the given ID.
   * @throws NotFoundException if the event is not found.
   */
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
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const slug = generateSlug(updateEventDto.title);

    const eventWithSlug = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (eventWithSlug && eventWithSlug.id !== id) {
      throw new ConflictException(
        `Event with title '${updateEventDto.title}' already exists`,
      );
    }

    return await this.prisma.event.update({
      where: { id },
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
  async remove(id: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({
      where: { id },
    });
  }

  /**
   * Registers a user for an event.
   * @param eventId - The ID of the event to register for.
   * @param userId - The ID of the user to register.
   * @returns A message indicating the result of the registration.
   * @throws NotFoundException if the event or user is not found.
   * @throws ConflictException if the event is full or the user is already registered.
   */
  async registerUserInEvent(
    eventId: string,
    userId: string,
  ): Promise<{ message: string }> {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const checkIns = await prisma.checkIn.count({
        where: { eventId },
      });

      const today = new Date();
      const eventEndDate = new Date(event.dateEnd);

      if (
        today.toDateString() !== eventEndDate.toDateString() &&
        today > eventEndDate
      ) {
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
            eventId,
            userId,
          },
        },
      });

      if (existingCheckIn) {
        throw new ConflictException('User already registered in this event');
      }

      await prisma.checkIn.create({
        data: {
          eventId,
          userId,
        },
      });

      await this.mailService.sendRegistrationEmail(user, event);

      return { message: 'Registration successful' };
    });
  }
}

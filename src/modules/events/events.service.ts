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
    const events = await this.prisma.event.findMany();

    if (events.length === 0) {
      throw new NotFoundException('No events found');
    }

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
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
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/jwt/jwt-auth.guard';
import { EventsService } from './events.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

/**
 * Controller for handling event-related operations.
 */
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Creates a new event.
   * @param createEventDto - The data required to create an event.
   * @returns The created event.
   * @throws ConflictException if an event with the same title already exists.
   * @throws BadRequestException if the request data is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Creates an event',
    description: 'Creates a new event in the API.',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Event created successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Title already registered',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  /**
   * Lists all events.
   * @returns An array of events.
   * @throws NotFoundException if no events are found.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Lists all events',
    description: 'Retrieves a list of all events from the API.',
  })
  @ApiOkResponse({ status: 200, description: 'Events listed successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'No events found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  /**
   * Retrieves a specific event by ID.
   * @param id - The ID of the event to retrieve.
   * @returns The event with the specified ID.
   * @throws NotFoundException if the event is not found.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Lists a specific event',
    description: 'Retrieves details of a specific event from the API.',
  })
  @ApiOkResponse({ status: 200, description: 'Event listed successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findOne(slug);
  }

  /**
   * Updates an existing event.
   * @param id - The ID of the event to update.
   * @param updateEventDto - The data to update the event with.
   * @returns The updated event.
   * @throws NotFoundException if the event is not found.
   * @throws ConflictException if an event with the same title already exists.
   * @throws BadRequestException if the request data is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Updates an event',
    description: 'Updates an existing event in the API.',
  })
  @ApiOkResponse({ status: 200, description: 'Event updated successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Title already registered',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(slug, updateEventDto);
  }

  /**
   * Deletes an event.
   * @param id - The ID of the event to delete.
   * @returns A message indicating the result of the delete operation.
   * @throws NotFoundException if the event is not found.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Deletes an event',
    description: 'Deletes an event from the API.',
  })
  @ApiNoContentResponse({
    status: 204,
    description: 'Event deleted successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.eventsService.remove(slug);
  }

  /**
   * Registers a user for an event.
   * @param eventId - The ID of the event.
   * @param userId - The ID of the user.
   * @returns A message indicating the result of the registration.
   * @throws NotFoundException if the event is not found.
   * @throws ConflictException if the user is already registered or if the event is full.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Registers a user in an event',
    description: 'Registers a user for a specific event in the API.',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Registration successful',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiConflictResponse({
    status: 409,
    description:
      'User already registered for this event / Event is full / Cannot register: Age restriction',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':eventSlug/attendee/:userId/register')
  registerUserInEvent(
    @Param('eventSlug') eventSlug: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.registerUserInEvent(eventSlug, userId);
  }
}

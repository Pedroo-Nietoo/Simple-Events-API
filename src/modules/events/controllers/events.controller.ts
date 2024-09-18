import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
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
} from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Creates a event',
    description: 'Creates a event on the API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Event created successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Title already registered',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: 'Lists all events',
    description: 'Lists all events on the API',
  })
  @ApiOkResponse({ status: 200, description: 'Events listed successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'No events found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({
    summary: 'Lists a specific event',
    description: 'Lists a event on the API',
  })
  @ApiOkResponse({ status: 200, description: 'Event listed successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Updates a event',
    description: 'Updates a event on the API',
  })
  @ApiOkResponse({ status: 200, description: 'Event updated successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({
    summary: 'Deletes a event',
    description: 'Deletes a event on the API',
  })
  @ApiNoContentResponse({
    status: 204,
    description: 'Event deleted successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @ApiOperation({
    summary: 'Registers a user in a event',
    description: 'egisters a user in a event on the API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Registration successful',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
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
  @Post(':eventId/attendee/:userId/register')
  registerUserInEvent(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.registerUserInEvent(eventId, userId);
  }
}

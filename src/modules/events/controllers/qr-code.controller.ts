import { Controller, Get, Post, Param } from '@nestjs/common';

import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QrCodeService } from '../services/qr-code.service';

@ApiTags('Events')
@Controller('events')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @ApiOperation({
    summary: 'Get badge QR code',
    description: 'Generates a QR Code for event check-in',
  })
  @ApiOkResponse({
    status: 200,
    description: 'QR Code generated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found / User not registered in this event',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':eventId/attendee/:userId/badge')
  getBadge(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.qrCodeService.getBadge(eventId, userId);
  }

  @ApiOperation({
    summary: 'Checks in a user in a event',
    description: 'Checks in a user in a event on the API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Check-in successful',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User is not registered in this event',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already checked in for this event',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post(':eventId/attendee/:userId/check-in')
  checkIn(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.qrCodeService.checkIn(eventId, userId);
  }
}

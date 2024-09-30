import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { QrCodeService } from './qr-code.service';
import { JwtAuthGuard } from '@/modules/auth/jwt/jwt-auth.guard';

/**
 * Controller for handling QR-Code-related operations.
 */
@ApiTags('Events')
@Controller('events')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  /**
   * Generates a QR Code for event check-in.
   * @param eventId - The ID of the event.
   * @param userId - The ID of the user.
   * @returns The QR Code data URL for check-in.
   * @throws NotFoundException if the event is not found or if the user is not registered for the event.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
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
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Event not found / User not registered in this event',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':eventSlug/attendee/:userId/badge')
  getBadge(
    @Param('eventSlug') eventSlug: string,
    @Param('userId') userId: string,
  ) {
    return this.qrCodeService.getBadge(eventSlug, userId);
  }

  /**
   * Checks in a user for an event.
   * @param eventId - The ID of the event.
   * @param userId - The ID of the user.
   * @returns A message indicating the result of the check-in.
   * @throws NotFoundException if the user is not registered for the event.
   * @throws ConflictException if the user has already checked in.
   * @throws BadRequestException if the request is invalid.
   * @throws UnauthorizedException if the user is not logged in.
   * @throws InternalServerErrorException for unexpected server errors.
   */
  @ApiOperation({
    summary: 'Checks in a user to an event',
    description: 'Checks in a user for a specific event.',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Check-in successful',
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Cannot generate QR Code. Only generation with 1 hour or less remaining will be allowed',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':eventId/attendee/:userId/check-in')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventCreatorId: {
          type: 'string',
          description: 'The ID of the event creator',
        },
      },
      required: ['eventCreatorId'],
    },
  })
  checkIn(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body('eventCreatorId') eventCreatorId: string,
  ) {
    return this.qrCodeService.checkIn(eventId, userId, eventCreatorId);
  }
}

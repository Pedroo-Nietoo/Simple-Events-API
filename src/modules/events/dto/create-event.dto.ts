import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * Data Transfer Object for creating an event.
 * Implements the structure for event creation input.
 */
export class CreateEventDto {
  /**
   * The title of the event.
   * @example 'My Event'
   */
  @ApiProperty({
    description: 'The title of the event',
    type: 'string',
    required: true,
    example: 'My Event',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Optional details about the event.
   * @example 'A description of my event'
   */
  @ApiProperty({
    description: 'The description of the event',
    type: 'string',
    required: false,
    example: 'A description of my event',
  })
  @IsString()
  @IsOptional()
  details?: string;

  /**
   * The slug for the event, used in URLs.
   */
  @ApiProperty({
    description: 'The slug for the event, used in URLs',
    type: 'string',
    required: true,
    example: 'my-event',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  /**
   * Optional maximum number of attendees for the event.
   * @example 100
   */
  @ApiProperty({
    description: 'The maximum number of attendees for the event',
    type: 'number',
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  maximumAttendees?: number;

  /**
   * Optional flag indicating if the event is age-restricted.
   * @example true
   */
  @ApiProperty({
    description:
      'If the event requires a minimum age of 18 years old to attend the event',
    type: 'boolean',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  ageRestricted?: boolean;

  /**
   * The start date and time of the event.
   * @example '2024-08-06T00:00:00.000Z'
   */
  @ApiProperty({
    description: 'The start date of the event',
    type: 'string',
    format: 'date-time',
    required: true,
    example: '2024-08-06T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  /**
   * The end date and time of the event.
   * @example '2024-08-07T00:00:00.000Z'
   */
  @ApiProperty({
    description: 'The end date of the event',
    type: 'string',
    format: 'date-time',
    required: true,
    example: '2024-08-07T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;

  /**
   * The start time of the event.
   * @example '15:30:00'
   */
  @ApiProperty({
    description: 'The start time of the event',
    type: 'string',
    format: 'date-time',
    required: true,
    example: '2024-08-07T15:30:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  startTime: Date;
}

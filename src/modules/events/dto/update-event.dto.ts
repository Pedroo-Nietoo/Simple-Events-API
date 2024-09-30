import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

/**
 * Data Transfer Object for updating an event.
 * Extends the CreateEventDto to allow partial updates.
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {
  /**
   * The title of the event.
   * @example 'Updated Event Title'
   */
  @ApiProperty({
    description: 'The title of the event',
    type: 'string',
    required: false,
    example: 'Updated Event Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * The description of the event.
   * @example 'Updated description of my event'
   */
  @ApiProperty({
    description: 'The description of the event',
    type: 'string',
    required: false,
    example: 'Updated description of my event',
  })
  @IsString()
  @IsOptional()
  details?: string;

  /**
   * The maximum number of attendees for the event.
   * @example 150
   */
  @ApiProperty({
    description: 'The maximum number of attendees for the event',
    type: 'number',
    required: false,
    example: 150,
  })
  @IsNumber()
  @IsOptional()
  maximumAttendees?: number;

  /**
   * Indicates if the event requires a minimum age of 18 years old to attend.
   * @example false
   */
  @ApiProperty({
    description:
      'If the event requires a minimum age of 18 years old to attend the event',
    type: 'boolean',
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  ageRestricted?: boolean;

  /**
   * The start date and time of the event in ISO 8601 format.
   * @example '2024-08-06T00:00:00.000Z'
   */
  @ApiProperty({
    description: 'The start date of the event',
    type: 'string',
    format: 'date-time',
    required: false,
    example: '2024-08-06T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  dateStart?: Date;

  /**
   * The end date and time of the event in ISO 8601 format.
   * @example '2024-08-07T00:00:00.000Z'
   */
  @ApiProperty({
    description: 'The end date of the event',
    type: 'string',
    format: 'date-time',
    required: false,
    example: '2024-08-07T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  dateEnd?: Date;

  /**
   * The ID of the user who created the event.
   * @type {string}
   */
  @ApiProperty({
    description: 'The ID of the user who created the event',
    type: 'string',
    required: true,
    example: '37eeb4d8-c202-4c5b-923c-97a19d0f77a1',
  })
  @IsString()
  @IsNotEmpty()
  eventCreatorId: string;
}

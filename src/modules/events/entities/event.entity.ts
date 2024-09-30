import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

/**
 * Represents an event entity with various properties.
 * Implements the Prisma.EventCreateInput interface.
 */
export class Event {
  /**
   * The title of the event.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Optional details about the event.
   * @type {string}
   */
  @IsString()
  @IsOptional()
  details?: string;

  /**
   * The slug for the event, used in URLs.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  slug: string;

  /**
   * Optional maximum number of attendees for the event.
   * @type {number}
   */
  @IsNumber()
  @IsOptional()
  maximumAttendees?: number;

  /**
   * Optional flag indicating if the event is age-restricted.
   * @type {boolean}
   */
  @IsBoolean()
  @IsOptional()
  ageRestricted?: boolean;

  /**
   * The start date and time of the event.
   * @type {Date}
   */
  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  /**
   * The end date and time of the event.
   * @type {Date}
   */
  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;

  /**
   * The ID of the user who created the event.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  eventCreatorId: string;
}

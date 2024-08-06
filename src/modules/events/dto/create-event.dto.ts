import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'The title of the event',
    type: 'string',
    required: true,
    example: 'My Event',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the event',
    type: 'string',
    required: false,
    example: 'A description of my event',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'The maximum number of attendees for the event',
    type: 'number',
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  maximumAttendees?: number;

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

  @ApiProperty({
    description: 'The start date of the event',
    type: 'Date',
    required: true,
    example: '2024-08-06',
  })
  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    description: 'The end date of the event',
    type: 'Date',
    required: true,
    example: '2024-08-07',
  })
  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;
}

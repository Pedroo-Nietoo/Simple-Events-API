import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsNumber()
  @IsOptional()
  maximumAttendees?: number;

  @IsBoolean()
  @IsOptional()
  ageRestricted?: boolean;

  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;
}

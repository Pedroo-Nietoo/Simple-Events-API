import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class Event implements Prisma.EventCreateInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

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

import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
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

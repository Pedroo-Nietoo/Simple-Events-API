import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsDate,
  IsOptional,
} from 'class-validator';

export class User implements Prisma.UserCreateInput {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;
}

import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsDate,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for creating a user.
 * Implements the Prisma.UserCreateInput interface.
 */
export class User implements Prisma.UserCreateInput {
  /**
   * The unique identifier for the user (optional during creation).
   * @type {string}
   */
  @IsOptional()
  id?: string;

  /**
   * The user's first name.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * The user's last name.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * The user's email address.
   * @type {string}
   */
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  /**
   * The user's password, with strong password requirements.
   * @type {string}
   */
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * The user's birth date.
   * @type {Date}
   */
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;
}

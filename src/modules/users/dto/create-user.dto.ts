import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new user.
 *
 * @class
 */
export class CreateUserDto {
  /**
   * The user's first name.
   * @example 'John'
   */
  @ApiProperty({
    description: 'First name of the user',
    type: 'string',
    required: true,
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * The user's last name.
   * @example 'Doe'
   */
  @ApiProperty({
    description: 'Last name of the user',
    type: 'string',
    required: true,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * The user's email address.
   * @example 'johndoe@example.com'
   */
  @ApiProperty({
    description: 'E-mail of the user',
    type: 'string',
    required: true,
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  /**
   * The user's password, with strong password requirements.
   * @example 'Password123!'
   */
  @ApiProperty({
    description: 'Password of the user',
    type: 'string',
    required: true,
    example: 'Password123!',
  })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * The user's birth date.
   * @example '2005-11-27'
   */
  @ApiProperty({
    description: 'Birth date of the user',
    type: 'string',
    format: 'date',
    required: true,
    example: '2005-11-27',
  })
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  /**
   * The profile image of the user.
   *
   * @remarks
   * This property is optional and can be used to store the binary data of the user's profile image.
   *
   * @property {string} image - The profile image of the user.
   */
  @ApiProperty({
    description: 'Profile image of the user',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: string;
}

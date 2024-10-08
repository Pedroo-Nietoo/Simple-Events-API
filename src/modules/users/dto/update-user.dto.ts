import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating a user.
 * Extends the CreateUserDto to allow partial updates.
 *
 * @class
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * The first name of the user.
   * @example 'John'
   */
  @ApiProperty({
    description: 'First name of the user',
    type: 'string',
    required: false,
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  /**
   * The last name of the user.
   * @example 'Doe'
   */
  @ApiProperty({
    description: 'Last name of the user',
    type: 'string',
    required: false,
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  /**
   * The email address of the user.
   * @example 'johndoe@example.com'
   */
  @ApiProperty({
    description: 'E-mail of the user',
    type: 'string',
    required: false,
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  /**
   * The password of the user, with strong password requirements.
   * @example 'Password123!'
   */
  @ApiProperty({
    description: 'Password of the user',
    type: 'string',
    required: false,
    example: 'Password123!',
  })
  @IsStrongPassword()
  @IsString()
  @IsOptional()
  password?: string;

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

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    type: 'string',
    required: true,
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    type: 'string',
    required: true,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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

  @ApiProperty({
    description: 'Birth date of the user',
    type: 'Date',
    required: true,
    example: '2005-11-27',
  })
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;
}

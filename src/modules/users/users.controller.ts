import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { SwaggerErrorResponse } from '@/swagger/errors/error-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

/**
 * Controller for handling user-related operations.
 *
 * @class
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a user.
   * @param createUserDto - The data required to create a user.
   * @param file - The image file to upload.
   * @returns The created user.
   */
  @ApiOperation({
    summary: 'Creates a user',
    description: 'Creates a user on the API',
  })
  @ApiCreatedResponse({ status: 201, description: 'User created successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'E-mail already registered',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        image: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Multer.File,
  ) {
    return this.usersService.create(createUserDto, file);
  }

  /**
   * Lists all users.
   * @returns A list of all users.
   */
  @ApiOperation({
    summary: 'Lists all users',
    description: 'Lists all users on the API',
  })
  @ApiOkResponse({ status: 200, description: 'Users listed successfully' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'No users found',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Lists a specific user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID.
   */
  @ApiOperation({
    summary: 'Lists a specific user',
    description: 'Lists a user on the API',
  })
  @ApiOkResponse({ status: 200, description: 'User listed successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
    type: SwaggerErrorResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data to update the user with.
   * @returns The updated user.
   */
  @ApiOperation({
    summary: 'Updates a user',
    description: 'Updates a user on the API',
  })
  @ApiOkResponse({ status: 200, description: 'User updated successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
    type: SwaggerErrorResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerErrorResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'E-mail already registered',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A success message.
   */
  @ApiOperation({
    summary: 'Deletes a user',
    description: 'Deletes a user on the API',
  })
  @ApiNoContentResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'User not logged in',
    type: SwaggerErrorResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { SwaggerErrorResponse } from '@/swagger/errors/error-response';

/**
 * Controller for handling authentication operations.
 *
 * @class
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs in a user and returns a JWT token.
   * @param body - The login credentials containing `email` and `password`.
   * @returns The JWT token if credentials are valid.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  @ApiOperation({
    summary: 'Logs in a user',
    description: 'Logs in a user on the API',
  })
  @ApiOkResponse({ status: 201, description: 'User logged in successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid credentials',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'johndoe@example.com' },
        password: { type: 'string', example: 'Password123!' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  /**
   * Returns the profile of the currently logged-in user.
   * @param req - The request object containing the authenticated user.
   * @returns The profile of the currently logged-in user.
   * @throws UnauthorizedException if the request is not authenticated.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns the user profile',
    description: 'Returns the current user profile',
  })
  @ApiOkResponse({ status: 201, description: 'Profile returned successfully' })
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
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Generates a new access token using a refresh token.
   * @param body - The refresh token.
   * @returns The new access token.
   * @throws UnauthorizedException if the refresh token is invalid.
   */
  @ApiOperation({
    summary: 'Generates a new access token',
    description: 'Generates a new access token using the refresh token',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Access token refreshed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerErrorResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid refresh token',
    type: SwaggerErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
    type: SwaggerErrorResponse,
  })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string', example: 'your-refresh-token' },
      },
    },
  })
  @Post('refresh-token')
  async refreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}

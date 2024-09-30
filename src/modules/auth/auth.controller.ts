import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
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

/**
 * Controller for handling authentication operations.
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
  @ApiOkResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('login')
  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, password: { type: 'string' } },
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
  @ApiOkResponse({ status: 200, description: 'Profile returned successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
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
    description: 'Generates a new access token using a refresh token',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Access token generated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('refresh-token/:token')
  async refreshToken(@Param('token') token: string) {
    return this.authService.refreshToken(token);
  }
}

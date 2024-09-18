import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that implements JWT-based authentication.
 *
 * This guard extends the `AuthGuard` class provided by `@nestjs/passport`
 * and uses the 'jwt' strategy to protect routes.
 *
 * @see AuthGuard
 * @see JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

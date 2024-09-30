import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy class extends the PassportStrategy for JWT authentication.
 *
 * @class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a new instance of the JWT strategy.
   *
   * @param {ConfigService} configService - The configuration service used to retrieve the JWT secret.
   */
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and returns a user object.
   *
   * @param payload - The JWT payload containing user information.
   * @returns An object containing the user's id, firstName, lastName, email, and birthDate.
   */
  async validate(payload: any) {
    return {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      birthDate: payload.birthDate,
    };
  }
}

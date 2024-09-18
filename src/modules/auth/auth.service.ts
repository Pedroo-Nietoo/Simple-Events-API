import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Service for authentication operations.
 */
@Injectable()
export class AuthService {
  /**
   * Constructs an instance of AuthService.
   *
   * @param usersService - The service used to manage user data.
   * @param jwtService - The service used to handle JSON Web Tokens.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   * @param email - The email of the user.
   * @param pass - The password provided by the user.
   * @returns The user object if credentials are valid; otherwise, null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const validUser = await bcrypt.compare(pass, user.password);

    if (validUser) {
      return user;
    }

    return null;
  }

  /**
   * Logs in a user and generates a JWT token.
   * @param user - The user object to be included in the JWT payload.
   * @returns The generated JWT token.
   */
  async login(user: any) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
    };
    return this.jwtService.sign(payload);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    // Validação de usuário
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

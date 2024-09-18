import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // Importar o módulo de Users
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaService } from '@/core/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: { expiresIn: '60m' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    PrismaService,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

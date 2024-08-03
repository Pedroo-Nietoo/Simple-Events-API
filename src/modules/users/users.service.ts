import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import * as bcypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcypt.genSaltSync();
    createUserDto.password = await bcypt.hashSync(createUserDto.password, salt);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        birthDate: new Date(createUserDto.birthDate),
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const salt = bcypt.genSaltSync();
      updateUserDto.password = bcypt.hashSync(updateUserDto.password, salt);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully', status: 204 };
  }
}

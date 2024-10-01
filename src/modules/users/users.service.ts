import { Multer } from 'multer';
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
import { S3Service } from '@/common/aws/s3/s3.service';

/**
 * Service dealing with user-related operations.
 *
 * @class
 */
@Injectable()
export class UsersService {
  /**
   * Constructs an instance of the UsersService.
   *
   * @param {PrismaService} prisma - The Prisma service used for database operations.
   */
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - Data Transfer Object containing user creation details.
   * @param file - The image file to upload.
   * @returns The created user.
   * @throws ConflictException if the email is already registered.
   */
  async create(
    createUserDto: CreateUserDto,
    file?: Multer.File,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new ConflictException('E-mail already registered');
    }

    const salt = await bcypt.genSaltSync();
    createUserDto.password = await bcypt.hashSync(createUserDto.password, salt);

    if (file) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      const key = `users/${Date.now()}-${createUserDto.firstName.toLowerCase()}-${createUserDto.lastName.toLowerCase()}-${file.originalname}`;
      const contentType = file.mimetype;

      const imageUrl = await this.s3Service.uploadImage(
        bucketName,
        key,
        file.buffer,
        contentType,
      );
      createUserDto.image = imageUrl;
    } else {
      createUserDto.image = null;
    }

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        birthDate: new Date(createUserDto.birthDate),
      },
    });
  }

  /**
   * Retrieves all users.
   * @returns An array of users.
   * @throws NotFoundException if no users are found.
   */
  async findAll(): Promise<User[] | object[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
        checkIns: true,
      },
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID.
   * @throws NotFoundException if the user is not found.
   */
  async findOne(id: string): Promise<User | object> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
        checkIns: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user to retrieve.
   * @returns The user with the specified email.
   * @throws NotFoundException if the user is not found.
   */
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Updates a user's details.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing user update details.
   * @returns The updated user.
   * @throws NotFoundException if the user is not found.
   * @throws ConflictException if the email is already registered.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email: updateUserDto.email,
      },
    });

    if (userWithSameEmail.email === updateUserDto.email) {
      throw new ConflictException('E-mail already registered');
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

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns An object containing a success message and status code.
   * @throws NotFoundException if the user is not found.
   */
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

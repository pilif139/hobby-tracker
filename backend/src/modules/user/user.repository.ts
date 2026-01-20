import { PrismaClient } from 'prisma/generated/prisma/client';
import {
  userResponseSelect,
  userWithHobbiesSelect,
  UserResponse,
  UserWithHobbies,
  UserCreateInput,
} from './user.dto';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userResponseSelect,
    });
  }

  async findByIdWithHobbies(id: string): Promise<UserWithHobbies | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userWithHobbiesSelect,
    });
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: userResponseSelect,
    });
  }

  async findAll(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: userResponseSelect,
    });
  }

  async create(data: UserCreateInput): Promise<UserResponse> {
    return this.prisma.user.create({
      data,
      select: userResponseSelect,
    });
  }

  async update(
    id: string,
    data: { name?: string; email?: string; password?: string },
  ): Promise<UserResponse> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userResponseSelect,
    });
  }

  async delete(id: string): Promise<UserResponse> {
    return this.prisma.user.delete({
      where: { id },
      select: userResponseSelect,
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return user !== null;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  }
}

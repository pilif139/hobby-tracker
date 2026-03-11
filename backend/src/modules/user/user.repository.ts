import { userResponseSelect } from './user.dto';
import type { PrismaClient } from '@/prisma/generated/client';
import type {
  UserCreateInput,
  UserUpdateInput,
} from '@/prisma/generated/models/User';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userResponseSelect,
    });
  }

  async findProfileById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            hobbies: true,
            hobbySessions: true,
            followedBy: true,
            follows: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: userResponseSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: userResponseSelect,
    });
  }

  async create(data: UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: userResponseSelect,
    });
  }

  async update(id: string, data: UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userResponseSelect,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: userResponseSelect,
    });
  }

  async exists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return user !== null;
  }

  async emailExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  }
}

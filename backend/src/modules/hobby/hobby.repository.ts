import { hobbyResponseSelect } from './hobby.dto';
import type { HobbyResponse } from './hobby.dto';
import type { PrismaClient } from '@/prisma/generated/client';
import type {
  HobbyCreateInput,
  HobbyUpdateInput,
} from '@/prisma/generated/models';

export class HobbyRepository {
  constructor(private prisma: PrismaClient) {}

  async search(
    search: string,
    { limit, offset }: { limit: number; offset: number },
  ): Promise<HobbyResponse[]> {
    return this.prisma.hobby.findMany({
      where: {
        name: { contains: search },
      },
      select: hobbyResponseSelect,
      take: limit,
      skip: offset,
    });
  }

  async findById(id: string): Promise<HobbyResponse | null> {
    return this.prisma.hobby.findUnique({
      where: { id },
      select: hobbyResponseSelect,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.hobby.findMany({
      where: {
        users: { some: { id: userId } },
      },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            hobbySessions: {
              where: { userId },
            },
          },
        },
      },
    });
  }

  async create(data: HobbyCreateInput): Promise<HobbyResponse> {
    return this.prisma.hobby.create({
      data,
      select: hobbyResponseSelect,
    });
  }

  async update(id: string, data: HobbyUpdateInput): Promise<HobbyResponse> {
    return this.prisma.hobby.update({
      where: { id },
      data,
      select: hobbyResponseSelect,
    });
  }

  async delete(id: string): Promise<HobbyResponse> {
    return this.prisma.hobby.delete({
      where: { id },
      select: hobbyResponseSelect,
    });
  }

  async exists(id: string): Promise<boolean> {
    const hobby = await this.prisma.hobby.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    return !!hobby;
  }

  async isUserLinkedToHobby(userId: string, hobbyId: string): Promise<boolean> {
    const hobby = await this.prisma.hobby.findFirst({
      where: {
        id: hobbyId,
        users: { some: { id: userId } },
      },
      select: { id: true },
    });
    return !!hobby;
  }

  async addUserToHobby(userId: string, hobbyId: string) {
    return this.prisma.hobby.update({
      where: { id: hobbyId },
      data: {
        users: { connect: { id: userId } },
      },
      select: hobbyResponseSelect,
    });
  }

  async removeUserFromHobby(userId: string, hobbyId: string) {
    return this.prisma.hobby.update({
      where: { id: hobbyId },
      data: {
        users: { disconnect: { id: userId } },
      },
      select: hobbyResponseSelect,
    });
  }
}

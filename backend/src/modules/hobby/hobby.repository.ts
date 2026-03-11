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

  async findAll(): Promise<HobbyResponse[]> {
    return this.prisma.hobby.findMany({
      select: hobbyResponseSelect,
    });
  }

  async findById(id: string): Promise<HobbyResponse | null> {
    return this.prisma.hobby.findUnique({
      where: { id },
      select: hobbyResponseSelect,
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
}

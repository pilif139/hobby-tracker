import type { Prisma, PrismaClient } from '@/prisma/generated/client';

export class HobbySessionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.hobbySession.findUnique({
      where: { id },
    });
  }

  async findByHobbyId(hobbyId: string) {
    return this.prisma.hobbySession.findMany({
      where: { hobbyId },
      select: {
        id: true,
        userId: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUserIdPaginated(userId: string, limit: number, offset: number) {
    return this.prisma.hobbySession.findMany({
      where: { userId },
      select: {
        id: true,
        hobbyId: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit,
      skip: offset,
    });
  }

  async create(data: Prisma.HobbySessionCreateInput) {
    return this.prisma.hobbySession.create({
      data,
    });
  }

  async update(id: string, data: Prisma.HobbySessionUpdateInput) {
    return this.prisma.hobbySession.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.hobbySession.delete({
      where: { id },
    });
  }
}

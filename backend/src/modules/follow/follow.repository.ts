import type { PrismaClient } from '@/prisma/generated/client';

export class FollowRepository {
  constructor(private prisma: PrismaClient) {}

  async create(followerId: string, followingId: string) {
    return this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async delete(followerId: string, followingId: string) {
    return this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  async findByFollowerId(followerId: string) {
    return this.prisma.follow.findMany({
      where: {
        followerId,
      },
      select: {
        createdAt: true,
        following: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByFollowingId(followingId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingId,
      },
      select: {
        createdAt: true,
        follower: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({
        where: {
          followingId: userId,
        },
      }),
      this.prisma.follow.count({
        where: {
          followerId: userId,
        },
      }),
    ]);

    return { followersCount, followingCount };
  }
}

import type { PrismaClient } from '@/prisma/generated/client';
import { ONE_DAY_IN_MS } from '@/src/lib/time';

export interface FeedSessionRow {
  id: string;
  startTime: Date;
  endTime: Date;
  notes: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatarFileKey: string | null;
  };
  hobby: {
    id: string;
    name: string;
  };
  files: { storageObjectKey: string }[];
}

export interface HobbyBasedSuggestionRow {
  id: string;
  name: string;
  avatarFileKey: string | null;
  sharedHobbyCount: number;
  sharedHobbies: string[];
}

export interface SocialBasedSuggestionRow {
  id: string;
  name: string;
  avatarFileKey: string | null;
  mutualConnectionCount: number;
}

export interface HobbySuggestionRow {
  id: string;
  name: string;
  description: string | null;
  sessionCount: number;
  userCount: number;
}

export class FeedRepository {
  constructor(private prisma: PrismaClient) {}

  async getSessionById(id: string) {
    return this.prisma.hobbySession.findUnique({
      where: { id },
      select: { id: true, createdAt: true },
    });
  }

  async getFeedSessions(
    userIds: string[],
    limit: number,
    cursor?: { createdAt: Date; id: string },
  ): Promise<FeedSessionRow[]> {
    if (userIds.length === 0) {
      return [];
    }

    return this.prisma.hobbySession.findMany({
      where: {
        userId: { in: userIds },
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarFileKey: true,
          },
        },
        hobby: {
          select: {
            id: true,
            name: true,
          },
        },
        files: { select: { storageObjectKey: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    });
  }

  async getHobbyBasedFollowSuggestions(
    userId: string,
    excludeUserIds: string[],
    limit: number,
  ): Promise<HobbyBasedSuggestionRow[]> {
    const userHobbies = await this.prisma.hobby.findMany({
      where: { users: { some: { id: userId } } },
      select: { id: true, name: true },
    });

    if (userHobbies.length === 0) {
      return [];
    }

    const hobbyIds = userHobbies.map((h) => h.id);
    const hobbyNameMap = new Map(userHobbies.map((h) => [h.id, h.name]));
    const allExcluded = [userId, ...excludeUserIds];

    const candidateUsers = await this.prisma.user.findMany({
      where: {
        id: { notIn: allExcluded },
        hobbies: { some: { id: { in: hobbyIds } } },
      },
      select: {
        id: true,
        name: true,
        avatarFileKey: true,
        hobbies: {
          where: { id: { in: hobbyIds } },
          select: { id: true },
        },
      },
    });

    return candidateUsers
      .map((user) => ({
        id: user.id,
        name: user.name,
        avatarFileKey: user.avatarFileKey,
        sharedHobbyCount: user.hobbies.length,
        sharedHobbies: user.hobbies
          .map((h) => hobbyNameMap.get(h.id))
          .filter((name): name is string => !!name),
      }))
      .sort((a, b) => b.sharedHobbyCount - a.sharedHobbyCount)
      .slice(0, limit);
  }

  async getSocialBasedFollowSuggestions(
    userId: string,
    followedUserIds: string[],
    limit: number,
  ): Promise<SocialBasedSuggestionRow[]> {
    if (followedUserIds.length === 0) {
      return [];
    }

    const allExcluded = [userId, ...followedUserIds];

    const friendsOfFriends = await this.prisma.follow.findMany({
      where: {
        followerId: { in: followedUserIds },
        followingId: { notIn: allExcluded },
      },
      select: { followingId: true },
    });

    if (friendsOfFriends.length === 0) {
      return [];
    }

    const frequencyMap = new Map<string, number>();
    for (const row of friendsOfFriends) {
      frequencyMap.set(
        row.followingId,
        (frequencyMap.get(row.followingId) ?? 0) + 1,
      );
    }

    const sortedCandidates = [...frequencyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    if (sortedCandidates.length === 0) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: sortedCandidates.map(([userId]) => userId) } },
      select: { id: true, name: true, avatarFileKey: true },
    });

    return sortedCandidates
      .map(([userId, count]) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          avatarFileKey: user.avatarFileKey,
          mutualConnectionCount: count,
        };
      })
      .filter((s): s is SocialBasedSuggestionRow => s !== null);
  }

  async getTrendingHobbySuggestions(
    userId: string,
    periodDays: number,
    limit: number,
  ): Promise<HobbySuggestionRow[]> {
    const cutoff = new Date(Date.now() - periodDays * ONE_DAY_IN_MS);

    const userHobbyIds = await this.prisma.hobby
      .findMany({
        where: { users: { some: { id: userId } } },
        select: { id: true },
      })
      .then((hobbies) => hobbies.map((h) => h.id));

    if (userHobbyIds.length === 0) {
      return [];
    }

    const hobbiesWithActivity = await this.prisma.hobby.findMany({
      where: {
        id: { notIn: userHobbyIds },
        hobbySessions: { some: { startTime: { gte: cutoff } } },
      },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            users: true,
            hobbySessions: {
              where: { startTime: { gte: cutoff } },
            },
          },
        },
      },
      orderBy: [{ hobbySessions: { _count: 'desc' } }, { name: 'asc' }],
      take: limit,
    });

    return hobbiesWithActivity.map((h) => ({
      id: h.id,
      name: h.name,
      description: h.description,
      sessionCount: h._count.hobbySessions,
      userCount: h._count.users,
    }));
  }
}

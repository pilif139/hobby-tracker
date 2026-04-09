import type { Prisma, PrismaClient } from '@/prisma/generated/client';
import { ONE_DAY_IN_MS } from '@/src/lib/time';

export interface AnalyticsFilters {
  userId: string;
  hobbyId?: string;
  from?: Date;
  to?: Date;
}

export interface HobbySessionAggregateRow {
  totalCount: number;
  totalDurationInSeconds: number;
  averageDurationInSeconds: number;
  minDurationInSeconds: number;
  maxDurationInSeconds: number;
  activeDaysCount: number;
  sessionsLast7Days: number;
  sessionsLast30Days: number;
  totalDurationLast7DaysInSeconds: number;
  totalDurationLast30DaysInSeconds: number;
}

export class HobbySessionRepository {
  constructor(private prisma: PrismaClient) {}

  private buildAnalyticsWhereInput({
    userId,
    hobbyId,
    from,
    to,
  }: AnalyticsFilters): Prisma.HobbySessionWhereInput {
    return {
      userId,
      ...(hobbyId ? { hobbyId } : {}),
      startTime: this.buildTimeRangeFilter(from, to),
    };
  }

  private buildTimeRangeFilter(from?: Date, to?: Date) {
    if (!from && !to) {
      return undefined;
    }

    return {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    };
  }

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
        hobbyId: true,
        userId: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByHobbyIdAndUserId(
    hobbyId: string,
    userId: string,
    from?: Date,
    to?: Date,
  ) {
    return this.prisma.hobbySession.findMany({
      where: {
        hobbyId,
        userId,
        startTime: this.buildTimeRangeFilter(from, to),
      },
      select: {
        id: true,
        hobbyId: true,
        userId: true,
        startTime: true,
        endTime: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUserIdPaginated(
    userId: string,
    limit: number,
    offset: number,
    from?: Date,
    to?: Date,
  ) {
    return this.prisma.hobbySession.findMany({
      where: {
        userId,
        startTime: this.buildTimeRangeFilter(from, to),
      },
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

  async getAnalytics(
    filters: AnalyticsFilters,
  ): Promise<HobbySessionAggregateRow> {
    const where = this.buildAnalyticsWhereInput(filters);
    const sessions = await this.prisma.hobbySession.findMany({
      where,
      select: {
        startTime: true,
        endTime: true,
      },
    });

    if (sessions.length === 0) {
      return {
        totalCount: 0,
        totalDurationInSeconds: 0,
        averageDurationInSeconds: 0,
        minDurationInSeconds: 0,
        maxDurationInSeconds: 0,
        activeDaysCount: 0,
        sessionsLast7Days: 0,
        sessionsLast30Days: 0,
        totalDurationLast7DaysInSeconds: 0,
        totalDurationLast30DaysInSeconds: 0,
      };
    }

    const nowMs = Date.now();
    const sevenDaysAgoMs = nowMs - 7 * ONE_DAY_IN_MS;
    const thirtyDaysAgoMs = nowMs - 30 * ONE_DAY_IN_MS;

    let totalDurationInSeconds = 0;
    let minDurationInSeconds = Number.POSITIVE_INFINITY;
    let maxDurationInSeconds = 0;
    let sessionsLast7Days = 0;
    let sessionsLast30Days = 0;
    let totalDurationLast7DaysInSeconds = 0;
    let totalDurationLast30DaysInSeconds = 0;

    const dayKeys = new Set<string>();

    for (const session of sessions) {
      const startMs = session.startTime.getTime();
      const endMs = session.endTime.getTime();
      const durationInSeconds = Math.max(
        0,
        Math.floor((endMs - startMs) / 1000),
      );

      totalDurationInSeconds += durationInSeconds;
      minDurationInSeconds = Math.min(minDurationInSeconds, durationInSeconds);
      maxDurationInSeconds = Math.max(maxDurationInSeconds, durationInSeconds);

      const dayKey = session.startTime.toISOString().slice(0, 10);
      dayKeys.add(dayKey);

      if (startMs >= sevenDaysAgoMs) {
        sessionsLast7Days += 1;
        totalDurationLast7DaysInSeconds += durationInSeconds;
      }

      if (startMs >= thirtyDaysAgoMs) {
        sessionsLast30Days += 1;
        totalDurationLast30DaysInSeconds += durationInSeconds;
      }
    }

    return {
      totalCount: sessions.length,
      totalDurationInSeconds,
      averageDurationInSeconds: Math.floor(
        totalDurationInSeconds / sessions.length,
      ),
      minDurationInSeconds: Number.isFinite(minDurationInSeconds)
        ? minDurationInSeconds
        : 0,
      maxDurationInSeconds,
      activeDaysCount: dayKeys.size,
      sessionsLast7Days,
      sessionsLast30Days,
      totalDurationLast7DaysInSeconds,
      totalDurationLast30DaysInSeconds,
    };
  }

  async getDistinctSessionDays(filters: AnalyticsFilters): Promise<string[]> {
    const where = this.buildAnalyticsWhereInput(filters);
    const sessions = await this.prisma.hobbySession.findMany({
      where,
      select: {
        startTime: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const uniqueDayKeys = new Set<string>();
    sessions.forEach((session) => {
      uniqueDayKeys.add(session.startTime.toISOString().slice(0, 10));
    });

    return Array.from(uniqueDayKeys);
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

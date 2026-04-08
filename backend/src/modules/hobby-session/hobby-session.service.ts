import type { HobbySessionRepository } from './hobby-session.repository';

interface CreateHobbySessionInput {
  startTime: Date | string;
  endTime: Date | string;
  durationInSeconds?: number | null;
  notes?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  hobbyId: string;
  userId: string;
}

interface UpdateHobbySessionInput {
  startTime?: Date | string;
  endTime?: Date | string;
  durationInSeconds?: number | null;
  notes?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  hobbyId?: string;
  userId?: string;
}

interface SessionStats {
  totalCount: number;
  totalDurationInSeconds: number;
  averageDurationInSeconds: number;
  minDurationInSeconds: number;
  maxDurationInSeconds: number;
  activeDaysCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  sessionsLast7Days: number;
  sessionsLast30Days: number;
  totalDurationLast7DaysInSeconds: number;
  totalDurationLast30DaysInSeconds: number;
}

interface SessionListFilters {
  limit?: number;
  offset?: number;
  from?: Date;
  to?: Date;
}

export class HobbySessionService {
  constructor(
    private readonly hobbySessionRepository: HobbySessionRepository,
  ) {}

  private getStreakStats(dayKeys: string[]) {
    if (dayKeys.length === 0) {
      return {
        activeDaysCount: 0,
        currentStreakDays: 0,
        longestStreakDays: 0,
      };
    }

    const dayMsList = dayKeys.map((dayKey) =>
      new Date(`${dayKey}T00:00:00.000Z`).getTime(),
    );

    let longestStreakDays = 1;
    let runningStreak = 1;

    for (let i = 1; i < dayMsList.length; i++) {
      const currentDayMs = dayMsList[i];
      const previousDayMs = dayMsList[i - 1];
      if (currentDayMs === undefined || previousDayMs === undefined) {
        continue;
      }

      const diffInDays = (currentDayMs - previousDayMs) / 86_400_000;
      if (diffInDays === 1) {
        runningStreak += 1;
        longestStreakDays = Math.max(longestStreakDays, runningStreak);
      } else {
        runningStreak = 1;
      }
    }

    let currentStreakDays = 1;
    for (let i = dayMsList.length - 1; i > 0; i--) {
      const currentDayMs = dayMsList[i];
      const previousDayMs = dayMsList[i - 1];
      if (currentDayMs === undefined || previousDayMs === undefined) {
        continue;
      }

      const diffInDays = (currentDayMs - previousDayMs) / 86_400_000;
      if (diffInDays === 1) {
        currentStreakDays += 1;
      } else {
        break;
      }
    }

    return {
      activeDaysCount: dayKeys.length,
      currentStreakDays,
      longestStreakDays,
    };
  }

  private async getStats(
    userId: string,
    hobbyId?: string,
    from?: Date,
    to?: Date,
  ): Promise<SessionStats> {
    const [aggregates, distinctDayKeys] = await Promise.all([
      this.hobbySessionRepository.getAnalytics({
        userId,
        hobbyId,
        from,
        to,
      }),
      this.hobbySessionRepository.getDistinctSessionDays({
        userId,
        hobbyId,
        from,
        to,
      }),
    ]);

    const streakStats = this.getStreakStats(distinctDayKeys);

    return {
      totalCount: aggregates.totalCount,
      totalDurationInSeconds: aggregates.totalDurationInSeconds,
      averageDurationInSeconds: aggregates.averageDurationInSeconds,
      minDurationInSeconds: aggregates.minDurationInSeconds,
      maxDurationInSeconds: aggregates.maxDurationInSeconds,
      activeDaysCount: aggregates.activeDaysCount,
      currentStreakDays: streakStats.currentStreakDays,
      longestStreakDays: streakStats.longestStreakDays,
      sessionsLast7Days: aggregates.sessionsLast7Days,
      sessionsLast30Days: aggregates.sessionsLast30Days,
      totalDurationLast7DaysInSeconds:
        aggregates.totalDurationLast7DaysInSeconds,
      totalDurationLast30DaysInSeconds:
        aggregates.totalDurationLast30DaysInSeconds,
    };
  }

  async findById(id: string) {
    return this.hobbySessionRepository.findById(id);
  }

  async getById(id: string) {
    return this.hobbySessionRepository.findById(id);
  }

  async findByHobbyId(hobbyId: string) {
    return this.hobbySessionRepository.findByHobbyId(hobbyId);
  }

  async findByHobbyIdAndUserId(
    hobbyId: string,
    userId: string,
    filters?: SessionListFilters,
  ) {
    const sessions = await this.hobbySessionRepository.findByHobbyIdAndUserId(
      hobbyId,
      userId,
      filters?.from,
      filters?.to,
    );
    const stats = await this.getStats(
      userId,
      hobbyId,
      filters?.from,
      filters?.to,
    );

    return {
      sessions,
      stats,
    };
  }

  async findByUserIdPaginatedWithStats(
    userId: string,
    filters?: SessionListFilters,
  ) {
    const sessions = await this.hobbySessionRepository.findByUserIdPaginated(
      userId,
      filters?.limit ?? 10,
      filters?.offset ?? 0,
      filters?.from,
      filters?.to,
    );
    const stats = await this.getStats(
      userId,
      undefined,
      filters?.from,
      filters?.to,
    );

    return {
      sessions,
      stats,
    };
  }

  async create(data: CreateHobbySessionInput) {
    const { hobbyId, userId, ...rest } = data;

    return this.hobbySessionRepository.create({
      ...rest,
      hobby: { connect: { id: hobbyId } },
      user: { connect: { id: userId } },
    });
  }

  async update(id: string, data: UpdateHobbySessionInput) {
    const { hobbyId, userId, ...rest } = data;

    return this.hobbySessionRepository.update(id, {
      ...rest,
      ...(hobbyId ? { hobby: { connect: { id: hobbyId } } } : {}),
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    });
  }

  async delete(id: string) {
    return this.hobbySessionRepository.delete(id);
  }
}

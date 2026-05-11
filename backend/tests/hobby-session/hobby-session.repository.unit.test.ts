import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@/prisma/generated/client';
import { ONE_DAY_IN_MS, ONE_SECOND_IN_MS } from '@/src/lib/time';
import { HobbySessionRepository } from '@/src/modules/hobby-session/hobby-session.repository';

const createPrismaMock = () => ({
  hobbySession: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

describe('HobbySessionRepository (unit)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('computes analytics aggregates from sessions', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-04-09T00:00:00.000Z');
    vi.setSystemTime(now);

    const prismaMock = createPrismaMock();
    const sessions = [
      {
        startTime: new Date('2026-04-08T10:00:00.000Z'),
        endTime: new Date('2026-04-08T11:00:00.000Z'),
      },
      {
        startTime: new Date('2026-04-05T10:00:00.000Z'),
        endTime: new Date('2026-04-05T10:30:00.000Z'),
      },
      {
        startTime: new Date('2026-03-20T10:00:00.000Z'),
        endTime: new Date('2026-03-20T11:30:00.000Z'),
      },
    ];
    prismaMock.hobbySession.findMany.mockResolvedValue(sessions);

    const sevenDaysAgoMs = now.getTime() - 7 * ONE_DAY_IN_MS;
    const thirtyDaysAgoMs = now.getTime() - 30 * ONE_DAY_IN_MS;

    const durationsInSeconds = sessions.map((session) =>
      Math.max(
        0,
        Math.floor(
          (session.endTime.getTime() - session.startTime.getTime()) /
            ONE_SECOND_IN_MS,
        ),
      ),
    );

    const sessionsWithDurations = sessions.map((session, index) => ({
      session,
      durationInSeconds: durationsInSeconds[index] ?? 0,
    }));

    const totalDurationInSeconds = durationsInSeconds.reduce(
      (sum, value) => sum + value,
      0,
    );

    const expectedStats = {
      totalCount: sessions.length,
      totalDurationInSeconds,
      averageDurationInSeconds: Math.floor(
        totalDurationInSeconds / sessions.length,
      ),
      minDurationInSeconds: Math.min(...durationsInSeconds),
      maxDurationInSeconds: Math.max(...durationsInSeconds),
      activeDaysCount: new Set(
        sessions.map((session) => session.startTime.toISOString().slice(0, 10)),
      ).size,
      sessionsLast7Days: sessions.filter(
        (session) => session.startTime.getTime() >= sevenDaysAgoMs,
      ).length,
      sessionsLast30Days: sessions.filter(
        (session) => session.startTime.getTime() >= thirtyDaysAgoMs,
      ).length,
      totalDurationLast7DaysInSeconds: sessionsWithDurations
        .filter(({ session }) => session.startTime.getTime() >= sevenDaysAgoMs)
        .reduce((sum, { durationInSeconds }) => sum + durationInSeconds, 0),
      totalDurationLast30DaysInSeconds: sessionsWithDurations
        .filter(({ session }) => session.startTime.getTime() >= thirtyDaysAgoMs)
        .reduce((sum, { durationInSeconds }) => sum + durationInSeconds, 0),
    };

    const repository = new HobbySessionRepository(
      prismaMock as unknown as PrismaClient,
      {} as R2Bucket,
    );

    const stats = await repository.getAnalytics({ userId: 'u1' });

    expect(stats).toEqual(expectedStats);
  });

  it('returns unique day keys sorted by startTime from prisma query', async () => {
    const prismaMock = createPrismaMock();
    prismaMock.hobbySession.findMany.mockResolvedValue([
      { startTime: new Date('2026-04-01T07:00:00.000Z') },
      { startTime: new Date('2026-04-01T21:00:00.000Z') },
      { startTime: new Date('2026-04-02T10:00:00.000Z') },
    ]);

    const repository = new HobbySessionRepository(
      prismaMock as unknown as PrismaClient,
      {} as R2Bucket,
    );

    const days = await repository.getDistinctSessionDays({ userId: 'u1' });

    expect(days).toEqual(['2026-04-01', '2026-04-02']);
    expect(prismaMock.hobbySession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { startTime: 'asc' },
      }),
    );
  });
});

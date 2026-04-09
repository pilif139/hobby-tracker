import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@/prisma/generated/client';
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
    vi.setSystemTime(new Date('2026-04-09T00:00:00.000Z'));

    const prismaMock = createPrismaMock();
    prismaMock.hobbySession.findMany.mockResolvedValue([
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
    ]);

    const repository = new HobbySessionRepository(
      prismaMock as unknown as PrismaClient,
    );

    const stats = await repository.getAnalytics({ userId: 'u1' });

    expect(stats).toEqual({
      totalCount: 3,
      totalDurationInSeconds: 10800,
      averageDurationInSeconds: 3600,
      minDurationInSeconds: 1800,
      maxDurationInSeconds: 5400,
      activeDaysCount: 3,
      sessionsLast7Days: 2,
      sessionsLast30Days: 3,
      totalDurationLast7DaysInSeconds: 5400,
      totalDurationLast30DaysInSeconds: 10800,
    });
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

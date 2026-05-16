import { Hono } from 'hono/quick';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import hobbySessionController from '@/src/modules/hobby-session/hobby-session.controller';
import type { HobbySessionRepository } from '@/src/modules/hobby-session/hobby-session.repository';
import { HobbySessionService } from '@/src/modules/hobby-session/hobby-session.service';
import type { AppContext } from '@/src/types';

const createRepositoryMock = () => ({
  findById: vi.fn(),
  findByIdWithFiles: vi.fn(),
  findByHobbyId: vi.fn(),
  findByHobbyIdAndUserId: vi.fn(),
  findByUserIdPaginated: vi.fn(),
  getAnalytics: vi.fn(),
  getDistinctSessionDays: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteSessionFiles: vi.fn(),
  uploadSessionFile: vi.fn(),
});

interface UserSessionsResponse {
  sessions: unknown[];
  stats: {
    currentStreakDays: number;
  };
}

describe('Hobby Session controller (integration)', () => {
  const userId = 'user-1';

  let repositoryMock: ReturnType<typeof createRepositoryMock>;
  let app: Hono<AppContext>;

  beforeEach(() => {
    repositoryMock = createRepositoryMock();

    const service = new HobbySessionService(
      repositoryMock as unknown as HobbySessionRepository,
      'https://bucket.example.com',
    );

    app = new Hono<AppContext>();
    app.use('*', async (c, next) => {
      c.set('userId', userId);
      c.set('services', {
        hobbySession: service,
      } as AppContext['Variables']['services']);
      await next();
    });

    app.route('/hobby-session', hobbySessionController);
  });

  it('POST /hobby-session creates session and returns 201', async () => {
    repositoryMock.create.mockResolvedValue({
      id: 's1',
      hobbyId: 'h1',
      userId,
      startTime: new Date('2026-04-09T10:00:00.000Z'),
      endTime: new Date('2026-04-09T11:00:00.000Z'),
      notes: 'focus',
      createdAt: new Date('2026-04-09T11:00:00.000Z'),
      updatedAt: new Date('2026-04-09T11:00:00.000Z'),
    });
    repositoryMock.findByIdWithFiles.mockResolvedValue({
      id: 's1',
      hobbyId: 'h1',
      userId,
      startTime: new Date('2026-04-09T10:00:00.000Z'),
      endTime: new Date('2026-04-09T11:00:00.000Z'),
      notes: 'focus',
      createdAt: new Date('2026-04-09T11:00:00.000Z'),
      updatedAt: new Date('2026-04-09T11:00:00.000Z'),
      files: [],
    });

    const form = new FormData();
    form.set('hobbyId', 'h1');
    form.set('startTime', '2026-04-09T10:00:00.000Z');
    form.set('endTime', '2026-04-09T11:00:00.000Z');
    form.set('notes', 'focus');

    const response = await app.request('http://localhost/hobby-session', {
      method: 'POST',
      body: form,
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        id: 's1',
        imageUrls: [],
      }),
    );
    expect(repositoryMock.create).toHaveBeenCalledOnce();
  });

  it('GET /hobby-session/user/:userId returns 403 for different user', async () => {
    const response = await app.request(
      'http://localhost/hobby-session/user/other-user',
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Unauthorized user');
  });

  it('GET /hobby-session/user/:userId validates date range and returns 400', async () => {
    const response = await app.request(
      `http://localhost/hobby-session/user/${userId}?from=2026-04-08T00:00:00.000Z&to=2026-04-01T00:00:00.000Z`,
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('from must be before or equal to to');
  });

  it('GET /hobby-session/user/:userId returns sessions + stats', async () => {
    repositoryMock.findByUserIdPaginated.mockResolvedValue([
      {
        id: 's1',
        hobbyId: 'h1',
        userId,
        startTime: new Date('2026-04-09T10:00:00.000Z'),
        endTime: new Date('2026-04-09T11:00:00.000Z'),
        notes: null,
        createdAt: new Date('2026-04-09T11:00:00.000Z'),
        updatedAt: new Date('2026-04-09T11:00:00.000Z'),
        files: [],
      },
    ]);
    repositoryMock.getAnalytics.mockResolvedValue({
      totalCount: 1,
      totalDurationInSeconds: 3600,
      averageDurationInSeconds: 3600,
      minDurationInSeconds: 3600,
      maxDurationInSeconds: 3600,
      activeDaysCount: 1,
      sessionsLast7Days: 1,
      sessionsLast30Days: 1,
      totalDurationLast7DaysInSeconds: 3600,
      totalDurationLast30DaysInSeconds: 3600,
    });
    repositoryMock.getDistinctSessionDays.mockResolvedValue(['2026-04-09']);

    const response = await app.request(
      `http://localhost/hobby-session/user/${userId}?limit=5&offset=0`,
    );

    expect(response.status).toBe(200);
    const body: UserSessionsResponse = await response.json();
    expect(body.sessions).toHaveLength(1);
    expect(body.stats.currentStreakDays).toBe(1);
    expect(repositoryMock.findByUserIdPaginated).toHaveBeenCalledWith(
      userId,
      5,
      0,
      undefined,
      undefined,
    );
  });
});

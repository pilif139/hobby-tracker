import { describe, expect, it, vi } from 'vitest';
import type { HobbySessionRepository } from '@/src/modules/hobby-session/hobby-session.repository';
import { HobbySessionService } from '@/src/modules/hobby-session/hobby-session.service';

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

describe('HobbySessionService (unit)', () => {
  it('maps create input IDs into Prisma connect objects', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.create.mockResolvedValue({ id: 's1' });
    repositoryMock.findByIdWithFiles.mockResolvedValue({
      id: 's1',
      hobbyId: 'h1',
      userId: 'u1',
      startTime: new Date('2026-04-01T10:00:00.000Z'),
      endTime: new Date('2026-04-01T11:00:00.000Z'),
      notes: 'focus',
      createdAt: new Date('2026-04-01T11:00:00.000Z'),
      updatedAt: new Date('2026-04-01T11:00:00.000Z'),
      files: [],
    });

    const service = new HobbySessionService(
      repositoryMock as unknown as HobbySessionRepository,
      'https://bucket.example.com',
    );

    const result = await service.create({
      startTime: '2026-04-01T10:00:00.000Z',
      endTime: '2026-04-01T11:00:00.000Z',
      notes: 'focus',
      hobbyId: 'h1',
      userId: 'u1',
    });

    expect(result).toEqual({
      id: 's1',
      hobbyId: 'h1',
      userId: 'u1',
      startTime: new Date('2026-04-01T10:00:00.000Z'),
      endTime: new Date('2026-04-01T11:00:00.000Z'),
      notes: 'focus',
      createdAt: new Date('2026-04-01T11:00:00.000Z'),
      updatedAt: new Date('2026-04-01T11:00:00.000Z'),
      imageUrls: [],
    });
    expect(repositoryMock.findByIdWithFiles).toHaveBeenCalledWith('s1');
    expect(repositoryMock.create).toHaveBeenCalledWith({
      startTime: '2026-04-01T10:00:00.000Z',
      endTime: '2026-04-01T11:00:00.000Z',
      notes: 'focus',
      hobby: { connect: { id: 'h1' } },
      user: { connect: { id: 'u1' } },
    });
  });

  it('maps optional update relation IDs into Prisma connect objects', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.update.mockResolvedValue({ id: 's1' });
    repositoryMock.findByIdWithFiles.mockResolvedValue({
      id: 's1',
      hobbyId: 'h2',
      userId: 'u9',
      startTime: new Date('2026-04-02T09:00:00.000Z'),
      endTime: new Date('2026-04-02T10:00:00.000Z'),
      notes: 'updated',
      createdAt: new Date('2026-04-01T11:00:00.000Z'),
      updatedAt: new Date('2026-04-03T08:00:00.000Z'),
      files: [],
    });

    const service = new HobbySessionService(
      repositoryMock as unknown as HobbySessionRepository,
      'https://bucket.example.com',
    );

    const result = await service.update('s1', 'u2', {
      hobbyId: 'h2',
      notes: 'updated',
    });

    expect(result).toEqual({
      id: 's1',
      hobbyId: 'h2',
      userId: 'u9',
      startTime: new Date('2026-04-02T09:00:00.000Z'),
      endTime: new Date('2026-04-02T10:00:00.000Z'),
      notes: 'updated',
      createdAt: new Date('2026-04-01T11:00:00.000Z'),
      updatedAt: new Date('2026-04-03T08:00:00.000Z'),
      imageUrls: [],
    });
    expect(repositoryMock.update).toHaveBeenCalledWith('s1', {
      notes: 'updated',
      hobby: { connect: { id: 'h2' } },
    });
    expect(repositoryMock.findByIdWithFiles).toHaveBeenCalledWith('s1');
  });

  it('returns sessions and computed streak stats for user paginated query', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.findByUserIdPaginated.mockResolvedValue([
      {
        id: 's1',
        hobbyId: 'h1',
        userId: 'u1',
        startTime: new Date('2026-04-01T10:00:00.000Z'),
        endTime: new Date('2026-04-01T11:00:00.000Z'),
        notes: null,
        createdAt: new Date('2026-04-01T11:00:00.000Z'),
        updatedAt: new Date('2026-04-01T11:00:00.000Z'),
        files: [],
      },
    ]);

    const mockAnalytics = {
      totalCount: 3,
      totalDurationInSeconds: 5400,
      averageDurationInSeconds: 1800,
      minDurationInSeconds: 1200,
      maxDurationInSeconds: 2400,
      activeDaysCount: 3,
      sessionsLast7Days: 2,
      sessionsLast30Days: 3,
      totalDurationLast7DaysInSeconds: 3000,
      totalDurationLast30DaysInSeconds: 5400,
    };

    repositoryMock.getAnalytics.mockResolvedValue(mockAnalytics);

    repositoryMock.getDistinctSessionDays.mockResolvedValue([
      '2026-04-01',
      '2026-04-02',
      '2026-04-04',
    ]);

    const service = new HobbySessionService(
      repositoryMock as unknown as HobbySessionRepository,
      'https://bucket.example.com',
    );

    const result = await service.findByUserIdPaginatedWithStats('u1', {
      limit: 5,
      offset: 0,
    });

    expect(repositoryMock.findByUserIdPaginated).toHaveBeenCalledWith(
      'u1',
      5,
      0,
      undefined,
      undefined,
    );

    expect(result.sessions).toHaveLength(1);
    expect(result.stats).toEqual({
      ...mockAnalytics,
      currentStreakDays: 1,
      longestStreakDays: 2,
    });
  });
});

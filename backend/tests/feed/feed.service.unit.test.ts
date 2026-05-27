import { describe, expect, it, vi } from 'vitest';
import type { FeedRepository } from '@/src/modules/feed/feed.repository';
import { FeedService } from '@/src/modules/feed/feed.service';
import type { FollowService } from '@/src/modules/follow/follow.service';

const createFeedRepositoryMock = () => ({
  getSessionById: vi.fn(),
  getFeedSessions: vi.fn(),
  getHobbyBasedFollowSuggestions: vi.fn(),
  getSocialBasedFollowSuggestions: vi.fn(),
  getTrendingHobbySuggestions: vi.fn(),
});

const createFollowServiceMock = () => ({
  getFollowingIds: vi.fn(),
});

describe('FeedService (unit)', () => {
  it('returns empty feed with null cursor when user follows nobody', async () => {
    const feedRepository = createFeedRepositoryMock();
    const followService = createFollowServiceMock();
    followService.getFollowingIds.mockResolvedValue([]);
    feedRepository.getFeedSessions.mockResolvedValue([]);

    const service = new FeedService(
      feedRepository as unknown as FeedRepository,
      followService as unknown as FollowService,
      'https://bucket.example.com',
    );

    const result = await service.getFeed('u1', 20);

    expect(result).toEqual({ sessions: [], nextCursor: null });
    expect(feedRepository.getFeedSessions).toHaveBeenCalledWith(
      ['u1'],
      21,
      undefined,
    );
  });

  it('uses cursor session lookup and returns next cursor when over limit', async () => {
    const feedRepository = createFeedRepositoryMock();
    const followService = createFollowServiceMock();

    const s1 = {
      id: 's3',
      startTime: new Date('2026-01-03T10:00:00.000Z'),
      endTime: new Date('2026-01-03T11:00:00.000Z'),
      notes: null,
      createdAt: new Date('2026-01-03T11:00:00.000Z'),
      user: { id: 'u2', name: 'A', avatarFileKey: null },
      hobby: { id: 'h1', name: 'Run' },
      files: [],
    };
    const s2 = {
      id: 's2',
      startTime: new Date('2026-01-02T10:00:00.000Z'),
      endTime: new Date('2026-01-02T11:00:00.000Z'),
      notes: 'x',
      createdAt: new Date('2026-01-02T11:00:00.000Z'),
      user: { id: 'u3', name: 'B', avatarFileKey: 'avatars/b.png' },
      hobby: { id: 'h2', name: 'Read' },
      files: [{ storageObjectKey: 'sessions/1.jpg' }],
    };
    const s3 = { ...s2, id: 's1' };

    followService.getFollowingIds.mockResolvedValue(['u2', 'u3']);
    feedRepository.getSessionById.mockResolvedValue({
      id: 'cursor-1',
      createdAt: new Date('2026-01-04T00:00:00.000Z'),
    });
    feedRepository.getFeedSessions.mockResolvedValue([s1, s2, s3]);

    const service = new FeedService(
      feedRepository as unknown as FeedRepository,
      followService as unknown as FollowService,
      'https://bucket.example.com',
    );

    const result = await service.getFeed('u1', 2, 'cursor-1');

    expect(feedRepository.getSessionById).toHaveBeenCalledWith('cursor-1');
    expect(feedRepository.getFeedSessions).toHaveBeenCalledWith(
      ['u2', 'u3', 'u1'],
      3,
      { id: 'cursor-1', createdAt: new Date('2026-01-04T00:00:00.000Z') },
    );
    expect(result.nextCursor).toBe('s2');
    expect(result.sessions).toHaveLength(2);
    expect(result.sessions[1]?.user.avatarUrl).toBe(
      'https://bucket.example.com/avatars/b.png',
    );
    expect(result.sessions[1]?.imageUrls).toEqual([
      'https://bucket.example.com/sessions/1.jpg',
    ]);
  });
});

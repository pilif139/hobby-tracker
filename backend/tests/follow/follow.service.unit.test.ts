import { describe, expect, it, vi } from 'vitest';
import type { FollowRepository } from '@/src/modules/follow/follow.repository';
import {
  FollowService,
  FollowUserNotFoundError,
} from '@/src/modules/follow/follow.service';
import type { UserRepository } from '@/src/modules/user/user.repository';

const createFollowRepositoryMock = () => ({
  create: vi.fn(),
  delete: vi.fn(),
  findByFollowerId: vi.fn(),
  findByFollowingId: vi.fn(),
  getFollowCounts: vi.fn(),
  getFollowingIds: vi.fn(),
});

const createUserRepositoryMock = () => ({
  exists: vi.fn(),
});

describe('FollowService (unit)', () => {
  it('creates follow when both users exist', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    userRepositoryMock.exists.mockResolvedValue(true);
    followRepositoryMock.create.mockResolvedValue({ success: true });

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    const result = await service.followUser('u1', 'u2');

    expect(result).toEqual({ success: true });
    expect(userRepositoryMock.exists).toHaveBeenCalledTimes(2);
    expect(followRepositoryMock.create).toHaveBeenCalledWith('u1', 'u2');
  });

  it('throws FollowUserNotFoundError when user does not exist', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    userRepositoryMock.exists
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    await expect(
      service.followUser('u1', 'missing-user'),
    ).rejects.toBeInstanceOf(FollowUserNotFoundError);
    expect(followRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('validates user existence before getting followers', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    userRepositoryMock.exists.mockResolvedValue(true);
    followRepositoryMock.findByFollowingId.mockResolvedValue([
      { follower: { id: 'u1', name: 'User 1' } },
    ]);

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    const result = await service.getFollowers('u2');

    expect(result).toHaveLength(1);
    expect(followRepositoryMock.findByFollowingId).toHaveBeenCalledWith('u2');
  });

  it('throws FollowUserNotFoundError in getFollowCounts for missing user', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    userRepositoryMock.exists.mockResolvedValue(false);

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    await expect(
      service.getFollowCounts('missing-user'),
    ).rejects.toBeInstanceOf(FollowUserNotFoundError);
    expect(followRepositoryMock.getFollowCounts).not.toHaveBeenCalled();
  });

  it('unfollows user when both users exist', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    userRepositoryMock.exists.mockResolvedValue(true);
    followRepositoryMock.delete.mockResolvedValue({ success: true });

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    const result = await service.unfollowUser('u1', 'u2');

    expect(result).toEqual({ success: true });
    expect(userRepositoryMock.exists).toHaveBeenCalledTimes(2);
    expect(followRepositoryMock.delete).toHaveBeenCalledWith('u1', 'u2');
  });

  it('returns following IDs directly from repository', async () => {
    const followRepositoryMock = createFollowRepositoryMock();
    const userRepositoryMock = createUserRepositoryMock();

    followRepositoryMock.getFollowingIds.mockResolvedValue(['u2', 'u3']);

    const service = new FollowService(
      followRepositoryMock as unknown as FollowRepository,
      userRepositoryMock as unknown as UserRepository,
    );

    const result = await service.getFollowingIds('u1');

    expect(result).toEqual(['u2', 'u3']);
    expect(followRepositoryMock.getFollowingIds).toHaveBeenCalledWith('u1');
    expect(userRepositoryMock.exists).not.toHaveBeenCalled();
  });
});

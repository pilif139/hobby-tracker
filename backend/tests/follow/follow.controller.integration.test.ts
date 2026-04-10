import { Hono } from 'hono/quick';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import followController from '@/src/modules/follow/follow.controller';
import { FollowUserNotFoundError } from '@/src/modules/follow/follow.service';
import type { AppContext } from '@/src/types';

const createFollowServiceMock = () => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
});

describe('Follow controller (integration)', () => {
  const userId = 'user-1';

  let followServiceMock: ReturnType<typeof createFollowServiceMock>;
  let app: Hono<AppContext>;

  beforeEach(() => {
    followServiceMock = createFollowServiceMock();

    app = new Hono<AppContext>();
    app.use('*', async (c, next) => {
      c.set('userId', userId);
      c.set('services', {
        follow: followServiceMock,
      } as unknown as AppContext['Variables']['services']);
      await next();
    });

    app.route('/follow', followController);
  });

  it('POST /follow returns 200 when follow succeeds', async () => {
    followServiceMock.followUser.mockResolvedValue({ success: true });

    const response = await app.request('http://localhost/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: userId,
        followingId: 'user-2',
      }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(followServiceMock.followUser).toHaveBeenCalledWith(userId, 'user-2');
  });

  it('POST /follow returns 400 when trying to follow yourself', async () => {
    const response = await app.request('http://localhost/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: userId,
        followingId: userId,
      }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Cannot follow yourself',
    });
    expect(followServiceMock.followUser).not.toHaveBeenCalled();
  });

  it('POST /follow returns 403 for unauthorized follower id', async () => {
    const response = await app.request('http://localhost/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: 'other-user',
        followingId: 'user-2',
      }),
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Unauthorized',
    });
    expect(followServiceMock.followUser).not.toHaveBeenCalled();
  });

  it('POST /follow returns 404 when one of users does not exist', async () => {
    followServiceMock.followUser.mockRejectedValue(
      new FollowUserNotFoundError('One or both users do not exist'),
    );

    const response = await app.request('http://localhost/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: userId,
        followingId: 'missing-user',
      }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'One or both users do not exist',
    });
  });

  it('DELETE /follow returns 200 when unfollow succeeds', async () => {
    followServiceMock.unfollowUser.mockResolvedValue({ success: true });

    const response = await app.request('http://localhost/follow', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: userId,
        followingId: 'user-2',
      }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(followServiceMock.unfollowUser).toHaveBeenCalledWith(
      userId,
      'user-2',
    );
  });
});

import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import { followDto, followResponseSchema } from './follow.dto';
import { FollowUserNotFoundError } from './follow.service';
import { jsonResponse, response } from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const followController = new Hono<AppContext>();

followController.post(
  '/',
  describeRoute({
    tags: ['Follow'],
    responses: {
      200: jsonResponse(followResponseSchema, 'Follow Result'),
      400: response.badRequest(),
      403: response.forbidden(),
      404: response.notFound(),
    },
  }),
  validator('json', followDto),
  async (c) => {
    const { followerId, followingId } = c.req.valid('json');

    if (followerId === followingId) {
      return c.json({ success: false, message: 'Cannot follow yourself' }, 400);
    }

    const userId = c.get('userId');
    if (userId !== followerId) {
      return c.json({ success: false, message: 'Unauthorized' }, 403);
    }

    const followService = c.get('services').follow;
    try {
      const result = await followService.followUser(followerId, followingId);

      return c.json(result);
    } catch (error) {
      if (error instanceof FollowUserNotFoundError) {
        return c.json({ message: error.message }, 404);
      }
      throw error;
    }
  },
);

followController.delete(
  '/',
  describeRoute({
    tags: ['Follow'],
    responses: {
      200: jsonResponse(followResponseSchema, 'Unfollow Result'),
      400: response.badRequest(),
      403: response.forbidden(),
      404: response.notFound(),
    },
  }),
  validator('json', followDto),
  async (c) => {
    const { followerId, followingId } = c.req.valid('json');

    if (followerId === followingId) {
      return c.json(
        { success: false, message: 'Cannot unfollow yourself' },
        400,
      );
    }

    const userId = c.get('userId');
    if (userId !== followerId) {
      return c.json({ success: false, message: 'Unauthorized' }, 403);
    }

    const followService = c.get('services').follow;
    try {
      const result = await followService.unfollowUser(followerId, followingId);
      return c.json(result);
    } catch (error) {
      if (error instanceof FollowUserNotFoundError) {
        return c.json({ message: error.message }, 404);
      }
      throw error;
    }
  },
);

export default followController;

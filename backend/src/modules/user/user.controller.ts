import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import {
  DeleteUserSchema,
  UpdateUserSchema,
  UserProfileSchema,
  UserSafeSchema,
} from './user.dto';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>()
  .get(
    '/:id',
    openApi({
      tags: ['User', 'Get By Id'],
      request: {
        param: z.object({
          id: z.uuid(),
        }),
      },
      responses: {
        200: UserProfileSchema,
        404: z.object({ error: z.string() }),
      },
    }),
    async (c) => {
      const userService = c.get('services').user;
      const id = c.req.param('id');
      const user = await userService.getProfileById(id);
      if (!user) {
        return c.notFound();
      }
      return c.json({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        followedByCount: user._count.followedBy,
        followsCount: user._count.follows,
        hobbiesCount: user._count.hobbies,
        hobbySessionsCount: user._count.hobbySessions,
      });
    },
  )
  .delete(
    '/:id',
    openApi({
      tags: ['User', 'Delete'],
      request: {
        query: DeleteUserSchema,
      },
      responses: {
        204: z.object(),
      },
    }),
    async (c) => {
      const id = c.req.param('id');
      const currentUserId = c.get('userId');
      if (currentUserId !== id) {
        c.status(403);
        return c.json({ error: 'Unauthorized user' });
      }

      const userService = c.get('services').user;

      const deleted = await userService.delete(id);
      if (!deleted) {
        c.status(404);
        return c.json({ error: 'User not found' });
      }
      c.status(204);
      return c.json(null);
    },
  )
  .patch(
    '/:id',
    openApi({
      tags: ['User', 'Update'],
      request: {
        json: UpdateUserSchema,
      },
      responses: {
        204: UserSafeSchema,
        404: z.object({ error: z.string() }),
      },
    }),
    async (c) => {
      const body = c.req.valid('json');
      const id = c.req.param('id');

      const currentUserId = c.get('userId');
      if (currentUserId !== id) {
        c.status(403);
        return c.json({ error: 'Unauthorized user' });
      }

      const userService = c.get('services').user;
      const updatedUser = await userService.update(id, body);

      if (!updatedUser) {
        return c.notFound();
      }

      c.status(204);
      return c.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    },
  );

export default userController;
export type UserApi = typeof userController;

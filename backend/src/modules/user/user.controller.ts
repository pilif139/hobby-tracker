import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import {
  DeleteUserSchema,
  UpdateUserSchema,
  UserProfileSchema,
  UserSafeSchema,
} from './user.dto';
import {
  NoContentResponseSchema,
  NotFoundResponseSchema,
  ForbiddenResponseSchema,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>()
  .get(
    '/:id',
    openApi({
      tags: ['User', 'Get By Id'],
      request: {
        param: z.object({
          id: z.string(), // even though its a UUID we treat it as string so that zod doesnt throw an error when validating the path parameter, and we can return a 404 if the user is not found instead of a 400 bad request error
        }),
      },
      responses: {
        200: UserProfileSchema,
        404: NotFoundResponseSchema,
      },
    }),
    async (c) => {
      const userService = c.get('services').user;
      const id = c.req.param('id');
      const user = await userService.getProfileById(id);
      if (!user) {
        return c.var.res(404, { message: 'User not found' });
      }
      return c.var.res({
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
        204: NoContentResponseSchema,
        403: ForbiddenResponseSchema,
        404: NotFoundResponseSchema,
      },
    }),
    async (c) => {
      const id = c.req.param('id');
      const currentUserId = c.get('userId');
      if (currentUserId !== id) {
        return c.var.res(403, { message: 'Unauthorized user' });
      }

      const userService = c.get('services').user;

      const deleted = await userService.delete(id);
      if (!deleted) {
        return c.var.res(404, { message: 'User not found' });
      }
      return c.var.res(204, null);
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
        200: UserSafeSchema,
        403: ForbiddenResponseSchema,
        404: NotFoundResponseSchema,
      },
    }),
    async (c) => {
      const body = c.req.valid('json');
      const id = c.req.param('id');

      const currentUserId = c.get('userId');
      if (currentUserId !== id) {
        return c.var.res(403, { message: 'Unauthorized user' });
      }

      const userService = c.get('services').user;
      const updatedUser = await userService.update(id, body);

      if (!updatedUser) {
        return c.var.res(404, { message: 'User not found' });
      }

      return c.var.res({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    },
  );

export default userController;
export type UserApi = typeof userController;

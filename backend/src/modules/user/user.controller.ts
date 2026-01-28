import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import { DeleteUserSchema, UpdateUserSchema, UserSafeSchema } from './user.dto';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>()
  .get(
    '/',
    openApi({
      tags: ['User', 'Get All'],
      responses: { 200: z.array(UserSafeSchema) },
    }),
    async (c) => {
      const userService = c.get('services').user;
      const users = await userService.getAll();
      return c.json(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        })),
      );
    },
  )
  .delete(
    '/:id',
    openApi({
      tags: ['User', 'Delete'],
      request: {
        json: DeleteUserSchema,
      },
      responses: {
        200: z.object({ deleted: z.boolean() }),
      },
    }),
    async (c) => {
      const id = c.req.param('id');
      const userService = c.get('services').user;
      const deleted = await userService.delete(id);
      return c.json({ deleted });
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
        204: z.object({}),
      },
    }),
    (c) => {
      const body = c.req.valid('json');
      const id = c.req.param('id');
      const userService = c.get('services').user;
      return userService.update(id, body).then(() => {
        c.status(204);
      });
    },
  );

export default userController;

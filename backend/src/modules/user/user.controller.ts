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
        200: UserSafeSchema,
        404: z.object({ error: z.string() }),
      },
    }),
    async (c) => {
      const userService = c.get('services').user;
      const id = c.req.param('id');
      const user = await userService.getById(id);
      if (!user) {
        return c.notFound();
      }
      return c.json({
        id: user.id,
        name: user.name,
        email: user.email,
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
        204: UserSafeSchema,
        404: z.object({ error: z.string() }),
      },
    }),
    async (c) => {
      const body = c.req.valid('json');
      const id = c.req.param('id');
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

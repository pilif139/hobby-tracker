import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import { DeleteUserSchema, UpdateUserSchema } from './user.dto';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>()
  .get('/', async (c) => {
    const userService = c.get('services').user;
    const users = await userService.getAll();
    return c.json(users);
  })
  .delete('/:id', zValidator('json', DeleteUserSchema), async (c) => {
    const id = c.req.param('id');
    const userService = c.get('services').user;
    const deleted = await userService.delete(id);
    return c.json({ deleted });
  })
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

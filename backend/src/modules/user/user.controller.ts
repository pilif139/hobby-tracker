import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { CreateUserSchema, DeleteUserSchema } from './user.dto';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>()
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
  .post('/', zValidator('json', CreateUserSchema), async (c) => {
    const body = c.req.valid('json');
    const userService = c.get('services').user;
    const user = await userService.create(body);
    return c.json({ user });
  });

export default app;
// for rpc on client
export type UserApi = typeof app;

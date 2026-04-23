import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import z from 'zod';
import {
  UpdateUserSchema,
  UserProfileSchema,
  UserSafeSchema,
} from './user.dto';
import {
  NotFoundResponseSchema,
  ForbiddenResponseSchema,
  jsonResponse,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>();

userController.get(
  '/:id',
  describeRoute({
    tags: ['User'],
    responses: {
      200: jsonResponse(UserProfileSchema, 'User Profile'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const userService = c.get('services').user;
    const id = c.req.valid('param').id;
    const user = await userService.getProfileById(id);
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
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
);

userController.delete(
  '/:id',
  describeRoute({
    tags: ['User'],
    responses: {
      204: { description: 'No Content' },
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid('param').id;
    const currentUserId = c.get('userId');
    if (currentUserId !== id) {
      return c.json({ message: 'Unauthorized user' }, 403);
    }

    const userService = c.get('services').user;

    const deleted = await userService.delete(id);
    if (!deleted) {
      return c.json({ message: 'User not found' }, 404);
    }
    return c.body(null, 204);
  },
);

userController.patch(
  '/:id',
  describeRoute({
    tags: ['User'],
    responses: {
      200: jsonResponse(UserSafeSchema, 'Updated User'),
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('json', UpdateUserSchema),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const body = c.req.valid('json');
    const id = c.req.valid('param').id;

    const currentUserId = c.get('userId');
    if (currentUserId !== id) {
      return c.json({ message: 'Unauthorized user' }, 403);
    }

    const userService = c.get('services').user;
    const updatedUser = await userService.update(id, body);

    if (!updatedUser) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  },
);

export default userController;
export type UserApi = typeof userController;

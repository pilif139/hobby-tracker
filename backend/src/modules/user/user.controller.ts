import type { Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { deleteCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import z from 'zod';
import {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  getAuthCookieOptions,
} from '../auth/auth.config';
import {
  AvatarUploadResponse,
  UpdateUserSchema,
  UserProfileSchema,
  UserSafeSchema,
} from './user.dto';
import { InvalidImageFileExtensionException } from '@/src/lib/image';
import { jsonResponse, response } from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const userController = new Hono<AppContext>();

userController.get(
  '/:id',
  describeRoute({
    tags: ['User'],
    responses: {
      200: jsonResponse(UserProfileSchema, 'User Profile'),
      404: response.notFound(),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const userService = c.get('services').user;
    const id = c.req.valid('param').id;
    const user = await userService.getProfileById(id);
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }
    return c.json({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      followedByCount: user._count.followedBy,
      followsCount: user._count.follows,
      hobbiesCount: user._count.hobbies,
      hobbySessionsCount: user._count.hobbySessions,
      avatarUrl: userService.fileKeyToUrl(user.avatarFileKey),
    });
  },
);

userController.delete(
  '/me',
  describeRoute({
    tags: ['User'],
    responses: {
      204: response.noContent(),
      404: response.notFound(),
    },
  }),
  async (c) => {
    const currentUserId = c.get('userId');

    const userService = c.get('services').user;
    const authService = c.get('services').auth;

    await userService.delete(currentUserId);

    await authService.invalidateRefreshToken(currentUserId);
    deleteCookie(c, COOKIE_REFRESH_TOKEN_NAME, getAuthCookieOptions(c, 0));
    deleteCookie(c, COOKIE_ACCESS_TOKEN_NAME, getAuthCookieOptions(c, 0));

    return c.body(null, 204);
  },
);

userController.patch(
  '/me',
  describeRoute({
    tags: ['User'],
    responses: {
      200: jsonResponse(UserSafeSchema, 'Updated User'),
    },
  }),
  validator('json', UpdateUserSchema),
  async (c) => {
    const body = c.req.valid('json');
    const userService = c.get('services').user;
    const currentUserId = c.get('userId');
    const updatedUser = await userService.update(currentUserId, body);

    return c.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: userService.fileKeyToUrl(updatedUser.avatarFileKey),
    });
  },
);

userController.post(
  '/avatar',
  describeRoute({
    tags: ['User'],
    responses: {
      200: jsonResponse(AvatarUploadResponse, 'Avatar uploaded successfully'),
      413: response.contentTooLarge(),
      400: response.badRequest(),
      500: response.serverError(),
    },
  }),
  bodyLimit({
    maxSize: 5 * 1024 * 1024,
    onError: (c) => {
      (c as Context<AppContext>)
        .get('logger')
        .error(`Body limit error: Payload too large`);
      throw new HTTPException(413, {
        message: 'Avatar file is too large. Maximum size is 5MB.',
      });
    },
  }),
  validator(
    'form',
    z.object({
      file: z.instanceof(File),
    }),
  ),
  async (c) => {
    const { file } = c.req.valid('form');

    const currentUserId = c.get('userId');
    const userService = c.get('services').user;

    try {
      const url = await userService.uploadAvatar(currentUserId, file);
      return c.json({ message: 'Avatar uploaded successfully:', url });
    } catch (error) {
      if (error instanceof InvalidImageFileExtensionException) {
        throw new HTTPException(400, { message: error.message });
      }
      throw new HTTPException(500, {
        message: 'Failed to upload avatar',
        cause: String(error),
      });
    }
  },
);

export default userController;
export type UserApi = typeof userController;

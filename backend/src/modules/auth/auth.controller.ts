import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import z from 'zod';
import { UserSafeSchema } from '../user/user.dto';
import authConfig, { getAuthCookieOptions } from './auth.config';
import { LoginSchema, RegisterSchema } from './auth.dto';
import {
  jsonResponse,
  BadRequestResponseSchema,
  BaseMessageResponse,
  InternalServerErrorResponseSchema,
  UnauthorizedResponseSchema,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>()
  .post(
    '/login',
    describeRoute({
      tags: ['Authentication'],
      responses: {
        200: {
          ...jsonResponse(UserSafeSchema, 'Successfully logged in'),
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
            },
          },
        },
        401: jsonResponse(UnauthorizedResponseSchema, 'Unauthorized'),
      },
    }),
    validator('json', LoginSchema),
    async (c) => {
      const authService = c.get('services').auth;
      const { email, password } = c.req.valid('json');

      const loginResult = await authService
        .login(email, password)
        .catch((error: unknown) => {
          throw new HTTPException(500, { message: (error as Error).message });
        });

      if (!loginResult) {
        throw new HTTPException(401, { message: 'Invalid email or password' });
      }
      const { accessToken, refreshToken, user } = loginResult;

      setCookie(
        c,
        'accessToken',
        accessToken,
        getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      c.set('userId', user.id);
      return c.json(user);
    },
  )
  .post(
    '/register',
    describeRoute({
      tags: ['Authentication'],
      responses: {
        200: {
          ...jsonResponse(UserSafeSchema, 'Successfully registered user'),
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
            },
          },
        },
        403: jsonResponse(UnauthorizedResponseSchema, 'Forbidden'),
        500: jsonResponse(
          InternalServerErrorResponseSchema,
          'Internal Server Error',
        ),
      },
    }),
    validator('json', RegisterSchema),
    async (c) => {
      const request = c.req.valid('json');
      const authService = c.get('services').auth;

      const { accessToken, refreshToken, user } = await authService
        .register(request)
        .catch((error: unknown) => {
          throw new HTTPException(500, { message: (error as Error).message });
        });

      setCookie(
        c,
        'accessToken',
        accessToken,
        getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      c.set('userId', user.id);
      return c.json(user);
    },
  )
  .post(
    '/logout',
    describeRoute({
      tags: ['Authentication'],
      responses: {
        200: jsonResponse(BaseMessageResponse, 'Success'),
      },
    }),
    (c) => {
      deleteCookie(c, 'accessToken', getAuthCookieOptions(c, 0));
      deleteCookie(c, 'refreshToken', getAuthCookieOptions(c, 0));
      c.set('userId', '');
      return c.json({ message: 'Successfully logged out' });
    },
  )
  .post(
    '/logout-other-devices',
    describeRoute({
      tags: ['Authentication'],
      responses: {
        200: jsonResponse(BaseMessageResponse, 'Success'),
        400: jsonResponse(BadRequestResponseSchema, 'Bad Request'),
      },
    }),
    async (c) => {
      const authService = c.get('services').auth;
      const userId = c.get('userId');

      const refreshTokenCookie = getCookie(c, 'refreshToken');
      if (!refreshTokenCookie) {
        return c.json({ message: 'No refresh token provided' }, 400);
      }

      const { accessToken, refreshToken } = await authService
        .logoutFromOtherDevices(userId, refreshTokenCookie)
        .catch((error: unknown) => {
          throw new HTTPException(401, {
            cause: error instanceof Error ? error.cause : undefined,
            message:
              error instanceof Error
                ? error.message
                : 'Error logging out from other devices',
          });
        });

      setCookie(
        c,
        'accessToken',
        accessToken,
        getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      return c.json({ message: 'Logged out from other devices' });
    },
  );

export { app as authController };

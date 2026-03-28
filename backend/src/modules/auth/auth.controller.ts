import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import { UserSafeSchema } from '../user/user.dto';
import authConfig, { getAuthCookieOptions } from './auth.config';
import { LoginSchema, RegisterSchema } from './auth.dto';
import {
  BadRequestResponseSchema,
  BaseMessageResponse,
  InternalServerErrorResponseSchema,
  UnauthorizedResponseSchema,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>()
  .post(
    '/login',
    openApi({
      tags: ['Authentication'],
      request: {
        json: LoginSchema,
      },
      responses: {
        200: {
          schema: UserSafeSchema,
          description: 'Successfully logged in',
          headers: z.object({
            'Set-Cookie': z.string(),
          }),
        },
        401: UnauthorizedResponseSchema,
      },
    }),
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
      return c.var.res(user);
    },
  )
  .post(
    '/register',
    openApi({
      tags: ['Authentication'],
      request: {
        json: RegisterSchema,
      },
      responses: {
        200: {
          schema: UserSafeSchema,
          description: 'Successfully registered user',
          headers: z.object({
            'Set-Cookie': z.string(),
          }),
        },
        403: UnauthorizedResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }),
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
      return c.var.res(user);
    },
  )
  .post(
    '/logout',
    openApi({
      tags: ['Authentication'],
      responses: {
        200: BaseMessageResponse,
      },
    }),
    (c) => {
      deleteCookie(c, 'accessToken', getAuthCookieOptions(c, 0));
      deleteCookie(c, 'refreshToken', getAuthCookieOptions(c, 0));
      c.set('userId', '');
      return c.var.res({ message: 'Successfully logged out' });
    },
  )
  .post(
    '/logout-other-devices',
    openApi({
      tags: ['Authentication'],
      responses: {
        200: BaseMessageResponse,
        400: BadRequestResponseSchema,
      },
    }),
    async (c) => {
      const authService = c.get('services').auth;
      const userId = c.get('userId');

      const refreshTokenCookie = getCookie(c, 'refreshToken');
      if (!refreshTokenCookie) {
        return c.var.res(400, { message: 'No refresh token provided' });
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
      return c.var.res({ message: 'Logged out from other devices' });
    },
  );

export { app as authController };

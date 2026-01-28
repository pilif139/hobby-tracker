import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import { UserSafeSchema } from '../user/user.dto';
import authConfig, { getAuthCookieOptions } from './auth.config';
import { LoginSchema, RegisterSchema } from './auth.dto';
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
        200: UserSafeSchema,
        401: z.object({ message: z.string() }),
      },
    }),
    async (c) => {
      const authService = c.get('services').auth;
      const { email, password } = c.req.valid('json');

      const loginResult = await authService.login(email, password);
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
      return c.json(user);
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
        200: UserSafeSchema,
        500: z.object({ message: z.string() }),
      },
    }),
    async (c) => {
      const request = c.req.valid('json');
      const authService = c.get('services').auth;

      let accessToken, refreshToken, user;
      try {
        ({ accessToken, refreshToken, user } =
          await authService.register(request));
      } catch (error) {
        throw new HTTPException(500, { message: (error as Error).message });
      }

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
      return c.json(user);
    },
  )
  .post(
    '/logout',
    openApi({
      tags: ['Authentication'],
      responses: {
        200: z.object({ message: z.string() }),
      },
    }),
    (c) => {
      deleteCookie(c, 'accessToken', getAuthCookieOptions(c, 0));
      deleteCookie(c, 'refreshToken', getAuthCookieOptions(c, 0));
      return c.json({ message: 'Successfully logged out' });
    },
  )
  .post(
    '/logout-other-devices',
    openApi({
      tags: ['Authentication'],
      responses: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string(), cause: z.string().optional() }),
      },
    }),
    async (c) => {
      const authService = c.get('services').auth;
      const userId = c.get('userId');

      const refreshTokenCookie = getCookie(c, 'refreshToken');
      if (!refreshTokenCookie) {
        return c.json({ message: 'No refresh token provided' }, 400);
      }

      let accessToken, refreshToken: string;
      try {
        ({ accessToken, refreshToken } =
          await authService.logoutFromOtherDevices(userId, refreshTokenCookie));
      } catch (error: unknown) {
        throw new HTTPException(401, {
          cause: error instanceof Error ? error.cause : undefined,
          message:
            error instanceof Error
              ? error.message
              : 'Error logging out from other devices',
        });
      }

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

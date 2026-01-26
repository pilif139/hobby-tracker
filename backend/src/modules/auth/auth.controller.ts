import { Hono } from 'hono';
import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import type { CookieOptions } from 'hono/utils/cookie';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import { UserSafeSchema } from '../user/user.dto';
import authConfig from './auth.config';
import { LoginSchema, RegisterSchema } from './auth.dto';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>()
  .post(
    '/login',
    openApi({
      tags: ['Authentication', 'Login'],
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
        getCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      return c.json(user);
    },
  )
  .post(
    '/register',
    openApi({
      tags: ['Authentication', 'Register'],
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

      const { accessToken, refreshToken, user } =
        await authService.register(request);

      setCookie(
        c,
        'accessToken',
        accessToken,
        getCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      return c.json(user);
    },
  )
  .post(
    '/logout',
    openApi({
      tags: ['Authentication', 'Logout'],
      responses: {
        200: z.object({ message: z.string() }),
      },
    }),
    (c) => {
      deleteCookie(c, 'accessToken', getCookieOptions(c, 0));
      deleteCookie(c, 'refreshToken', getCookieOptions(c, 0));
      return c.json({ message: 'Successfully logged out' });
    },
  )
  .post(
    '/logout-other-devices',
    openApi({
      tags: ['Authentication', 'Logout'],
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
        getCookieOptions(c, authConfig.accessTokenExpirationTime),
      );

      setCookie(
        c,
        'refreshToken',
        refreshToken,
        getCookieOptions(c, authConfig.refreshTokenExpirationTime),
      );
      return c.json({ message: 'Logged out from other devices' });
    },
  );

function getCookieOptions(c: Context<AppContext>, maxAge: number) {
  return {
    httpOnly: true,
    secure: c.env.ENVIRONMENT === 'production',
    sameSite: 'Lax',
    path: '/',
    domain: c.env.ALLOWED_ORIGINS.split(',')[0], // TODO: improve for multiple domains
    maxAge,
  } as Partial<CookieOptions>;
}

export { app as authController };

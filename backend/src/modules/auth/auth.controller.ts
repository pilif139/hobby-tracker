import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import { UserSafeSchema } from '../user/user.dto';
import authConfig, {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  getAuthCookieOptions,
} from './auth.config';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from './auth.dto';
import {
  jsonResponse,
  BadRequestResponseSchema,
  BaseMessageResponse,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const app = new Hono<AppContext>();

app.post(
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
      COOKIE_ACCESS_TOKEN_NAME,
      accessToken,
      getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
    );

    setCookie(
      c,
      COOKIE_REFRESH_TOKEN_NAME,
      refreshToken,
      getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
    );
    c.set('userId', user.id);
    return c.json(user);
  },
);

app.post(
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
      COOKIE_ACCESS_TOKEN_NAME,
      accessToken,
      getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
    );

    setCookie(
      c,
      COOKIE_REFRESH_TOKEN_NAME,
      refreshToken,
      getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
    );
    c.set('userId', user.id);
    return c.json(user);
  },
);

app.get(
  '/me',
  describeRoute({
    tags: ['Authentication'],
    responses: {
      200: jsonResponse(UserSafeSchema, 'Current authenticated user'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  async (c) => {
    const userService = c.get('services').user;
    const userId = c.get('userId');
    const user = await userService.getById(userId);

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  },
);

app.post(
  '/logout',
  describeRoute({
    tags: ['Authentication'],
    responses: {
      200: jsonResponse(BaseMessageResponse, 'Success'),
    },
  }),
  (c) => {
    deleteCookie(c, COOKIE_ACCESS_TOKEN_NAME, getAuthCookieOptions(c, 0));
    deleteCookie(c, COOKIE_REFRESH_TOKEN_NAME, getAuthCookieOptions(c, 0));
    c.set('userId', '');
    return c.json({ message: 'Successfully logged out' });
  },
);

app.post(
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

    const refreshTokenCookie = getCookie(c, COOKIE_REFRESH_TOKEN_NAME);
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
      COOKIE_ACCESS_TOKEN_NAME,
      accessToken,
      getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
    );

    setCookie(
      c,
      COOKIE_REFRESH_TOKEN_NAME,
      refreshToken,
      getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
    );
    return c.json({ message: 'Logged out from other devices' });
  },
);

app.post(
  '/forgot-password',
  describeRoute({
    tags: ['Authentication'],
    responses: {
      200: jsonResponse(BaseMessageResponse, 'Success'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('json', ForgotPasswordSchema),
  async (c) => {
    const authService = c.get('services').auth;
    const { email } = c.req.valid('json');

    const userService = c.get('services').user;
    const user = await userService.getByEmail(email);
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    const token = await authService.generatePasswordResetToken(user.id);
    // when users click on the link, the frontend will send request to /reset-password with the token and the new password
    const resetLink = `${c.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    await authService.sendPasswordResetEmail(email, resetLink);

    return c.json({ message: 'Password reset email sent' });
  },
);

app.post(
  '/reset-password',
  describeRoute({
    tags: ['Authentication'],
    responses: {
      200: jsonResponse(BaseMessageResponse, 'Success'),
      400: jsonResponse(BadRequestResponseSchema, 'Bad Request'),
    },
  }),
  validator('json', ResetPasswordSchema),
  async (c) => {
    const authService = c.get('services').auth;
    const { token, newPassword } = c.req.valid('json');

    const userId = await authService.validatePasswordResetToken(token);
    if (!userId) {
      throw new HTTPException(400, { message: 'Invalid or expired token' });
    }

    const userService = c.get('services').user;
    await userService.updatePassword(userId, newPassword);

    await authService.invalidatePasswordResetToken(userId);

    return c.json({ message: 'Password reset successful' });
  },
);

export { app as authController };

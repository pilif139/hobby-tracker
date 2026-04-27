import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import authConfig, {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  getAuthCookieOptions,
} from '../modules/auth/auth.config';
import type { AppContext } from '../types';

// we dont want to allow user to login or register if they are already logged in
const GUEST_ONLY_PATHS = ['/auth/login', '/auth/register'];
const DEVELOPMENT_PATHS = ['/doc', '/scalar', '/health'];

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const isDevPath =
    c.env.ENVIRONMENT === 'development' &&
    DEVELOPMENT_PATHS.includes(c.req.path);
  if (isDevPath) {
    await next();
    return;
  }

  const isGuestOnlyPath = GUEST_ONLY_PATHS.includes(c.req.path);

  // For guest-only paths, check if user is already logged in
  if (isGuestOnlyPath) {
    const accessToken = getCookie(c, COOKIE_ACCESS_TOKEN_NAME);
    const refreshToken = getCookie(c, COOKIE_REFRESH_TOKEN_NAME);

    if (accessToken || refreshToken) {
      const authService = c.get('services').auth;
      const isValidAccess = accessToken
        ? await authService.validateAccessToken(accessToken)
        : null;
      const isValidRefresh = refreshToken
        ? await authService.validateRefreshToken(refreshToken)
        : null;

      if (isValidAccess || isValidRefresh) {
        return c.json(
          {
            message: 'Already authenticated. Please logout first.',
          },
          403,
        );
      }
    }

    await next();
    return;
  }

  const authService = c.get('services').auth;

  const accessToken = getCookie(c, COOKIE_ACCESS_TOKEN_NAME);
  const refreshToken = getCookie(c, COOKIE_REFRESH_TOKEN_NAME);

  if (accessToken) {
    const payload = await authService.validateAccessToken(accessToken);
    if (!payload) {
      c.get('logger').error('Invalid access token');
      return c.json({ message: 'Unauthorized' }, 401);
    }

    c.get('logger').info(`Authenticated user ID: ${payload}`);
    c.set('userId', payload);
  } else if (refreshToken) {
    const refreshPayload = await authService.validateRefreshToken(refreshToken);
    if (!refreshPayload) {
      c.get('logger').error('Invalid refresh token');
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const newAccessToken = await authService.generateAccessToken(
      refreshPayload.userId,
    );
    const regeneratedRefreshToken = await authService.generateRefreshToken(
      refreshPayload.userId,
      refreshPayload.token,
    );

    c.set('userId', refreshPayload.userId);
    c.get('logger').info(
      `Authenticated user ID (refresh): ${refreshPayload.userId}`,
    );
    setCookie(
      c,
      COOKIE_ACCESS_TOKEN_NAME,
      newAccessToken,
      getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
    );

    setCookie(
      c,
      COOKIE_REFRESH_TOKEN_NAME,
      regeneratedRefreshToken,
      getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
    );
  } else {
    c.get('logger').warn('Invalid access token and no refresh token provided');
    return c.json({ message: 'Unauthorized' }, 401);
  }

  await next();
});

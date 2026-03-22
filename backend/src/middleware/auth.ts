import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import authConfig, { getAuthCookieOptions } from '../modules/auth/auth.config';
import type { AppContext } from '../types';

// TODO: refactor to use regex in the app.use("/[regex]") and not here
const NEED_AUTH_PATHS = ['/user', '/auth/logout', '/auth/logout-other-devices'];

// we dont want to allow user to login or register if they are already logged in
const GUEST_ONLY_PATHS = ['/auth/login', '/auth/register'];

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const isGuestOnlyPath = GUEST_ONLY_PATHS.find((path) =>
    path.includes(c.req.path),
  );
  const isProtectedPath = NEED_AUTH_PATHS.find((path) =>
    path.includes(c.req.path),
  );

  // For guest-only paths, check if user is already logged in
  if (isGuestOnlyPath) {
    const accessToken = getCookie(c, 'accessToken');
    const refreshToken = getCookie(c, 'refreshToken');

    if (accessToken || refreshToken) {
      const authService = c.get('services').auth;
      const isValidAccess = accessToken
        ? await authService.validateAccessToken(accessToken)
        : null;
      const isValidRefresh = refreshToken
        ? await authService.validateRefreshToken(refreshToken)
        : null;

      if (isValidAccess || isValidRefresh) {
        throw new HTTPException(403, {
          message: 'Already authenticated. Please logout first.',
        });
      }
    }

    await next();
    return;
  }

  if (!isProtectedPath) {
    await next();
    return;
  }

  const authService = c.get('services').auth;

  const accessToken = getCookie(c, 'accessToken');
  const refreshToken = getCookie(c, 'refreshToken');

  if (accessToken) {
    const payload = await authService.validateAccessToken(accessToken);
    if (!payload) {
      c.get('logger').error('Invalid access token');
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    c.get('logger').info(`Authenticated user ID: ${payload}`);
    c.set('userId', payload);
  } else if (refreshToken) {
    const refreshPayload = await authService.validateRefreshToken(refreshToken);
    if (!refreshPayload) {
      c.get('logger').error('Invalid refresh token');
      throw new HTTPException(401, { message: 'Unauthorized' });
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
      'accessToken',
      newAccessToken,
      getAuthCookieOptions(c, authConfig.accessTokenExpirationTime),
    );

    setCookie(
      c,
      'refreshToken',
      regeneratedRefreshToken,
      getAuthCookieOptions(c, authConfig.refreshTokenExpirationTime),
    );
  } else {
    c.get('logger').error('Invalid access token and no refresh token provided');
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  await next();
});

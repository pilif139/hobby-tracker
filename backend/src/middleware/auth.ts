import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import authConfig, { getAuthCookieOptions } from '../modules/auth/auth.config';
import type { AppContext } from '../types';

const NEED_AUTH_PATHS = ['/user'];

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  if (!NEED_AUTH_PATHS.includes(c.req.path)) {
    await next();
    return;
  }

  const authService = c.get('services').auth;

  const accessToken = getCookie(c, 'accessToken');
  const refreshToken = getCookie(c, 'refreshToken');

  if (!accessToken) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const payload = await authService.validateAccessToken(accessToken);

  if (payload) {
    c.set('userId', payload);
  } else if (refreshToken) {
    const refreshPayload = await authService.validateRefreshToken(refreshToken);
    if (!refreshPayload) {
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
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  await next();
});

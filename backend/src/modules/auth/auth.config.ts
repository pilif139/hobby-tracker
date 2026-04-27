import type { Context } from 'hono';
import type { CookieOptions } from 'hono/utils/cookie';
import { ONE_DAY, ONE_MINUTE } from '@/src/lib/time';
import type { AppContext } from '@/src/types';

const authConfig = {
  accessTokenExpirationTime: ONE_MINUTE * 10,
  refreshTokenExpirationTime: ONE_DAY * 30,
} as const;

export default authConfig;
export const COOKIE_ACCESS_TOKEN_NAME = 'accessToken' as const;
export const COOKIE_REFRESH_TOKEN_NAME = 'refreshToken' as const;

export function getAuthCookieOptions<e extends AppContext>(
  c: Context<e>,
  maxAge: number,
) {
  return {
    httpOnly: true,
    secure: c.env.ENVIRONMENT === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge,
  } as CookieOptions;
}

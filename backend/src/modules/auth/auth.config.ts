import type { Context } from 'hono';
import type { CookieOptions } from 'hono/utils/cookie';
import { ONE_DAY, ONE_MINUTE } from '@/src/lib/time';
import type { AppContext } from '@/src/types';

const authConfig = {
  accessTokenExpirationTime: ONE_MINUTE * 10,
  refreshTokenExpirationTime: ONE_DAY * 30,
} as const;

export default authConfig;

export function getAuthCookieOptions(c: Context<AppContext>, maxAge: number) {
  return {
    httpOnly: true,
    secure: c.env.ENVIRONMENT === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge,
  } as CookieOptions;
}

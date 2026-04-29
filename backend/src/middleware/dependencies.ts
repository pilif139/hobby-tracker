import { createMiddleware } from 'hono/factory';
import { AuthService } from '../modules/auth/auth.service';
import { createFollowService } from '../modules/follow/follow.factory';
import { createUserService } from '../modules/user/user.factory';
import { createHobbyService } from '@/src/modules/hobby/hobby.factory';
import { createHobbySessionService } from '@/src/modules/hobby-session/hobby-session.factory';
import type { AppContext } from '@/src/types';

export const dependencyMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    c.set('services', {
      get user() {
        return createUserService(c.env.DB, c.env.R2, c.env.R2_BUCKET_URL);
      },
      get auth() {
        const userService = createUserService(
          c.env.DB,
          c.env.R2,
          c.env.R2_BUCKET_URL,
        );
        return new AuthService(
          userService,
          c.env.authKV,
          c.env.ACCESS_TOKEN_SECRET,
          c.env.REFRESH_TOKEN_SECRET,
        );
      },
      get hobby() {
        return createHobbyService(c.env.DB);
      },
      get hobbySession() {
        return createHobbySessionService(c.env.DB);
      },
      get follow() {
        return createFollowService(c.env.DB, c.env.R2);
      },
    });

    await next();
  },
);

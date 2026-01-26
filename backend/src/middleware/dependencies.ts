import { createMiddleware } from 'hono/factory';
import { AuthService } from '../modules/auth/auth.service';
import { createUserService } from '../modules/user/user.factory';
import { getPrismaClient } from '@/src/lib/prisma';
import type { AppContext } from '@/src/types';

export const dependencyMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const prisma = getPrismaClient(c.env.DB);

    c.set('services', {
      get user() {
        return createUserService(prisma);
      },
      get auth() {
        const userService = createUserService(prisma);
        return new AuthService(
          userService,
          c.env.authKV,
          c.env.ACCESS_TOKEN_SECRET,
          c.env.REFRESH_TOKEN_SECRET,
        );
      },
    });

    await next();
  },
);

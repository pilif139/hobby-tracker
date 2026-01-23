import { createMiddleware } from 'hono/factory';
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
    });

    await next();
  },
);

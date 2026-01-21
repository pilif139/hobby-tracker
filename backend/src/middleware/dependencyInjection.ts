import { createMiddleware } from 'hono/factory';
import { UserRepository } from '@/src/modules/user/user.repository';
import { UserService } from '@/src/modules/user/user.service';
import type { AppContext } from '@/src/types';

export const dependencyInjection = createMiddleware<AppContext>(
  async (c, next) => {
    const prisma = c.get('prisma');

    // repositories;
    const userRepository = new UserRepository(prisma);

    // services
    const userService = new UserService(userRepository);

    // setting values in app context
    c.set('services', {
      user: userService,
    });

    await next();
  },
);

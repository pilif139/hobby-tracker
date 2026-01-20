import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';
import { AppContext } from '@/types';
import { createMiddleware } from 'hono/factory';

export const dependencyInjection = createMiddleware<AppContext>(
  async (c, next) => {
    const prisma = c.get('prisma');

    // repositories
    // const userRepository = new UserRepository(prisma);

    // // services
    // const userService = new UserService(userRepository);

    // // setting values in app context
    // c.set("services", {
    //   user: userService,
    // })

    await next();
  },
);

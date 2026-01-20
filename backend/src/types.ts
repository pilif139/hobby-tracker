import { PrismaClient } from '../prisma/generated/prisma/client';
import { UserService } from '@/modules/user/user.service';

export type Bindings = {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: 'development' | 'production';
};

export type Variables = {
  prisma: PrismaClient;
  services: {
    user: UserService;
  };
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};

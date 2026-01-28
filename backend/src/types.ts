import type { AuthService } from './modules/auth/auth.service';
import type { UserService } from '@/src/modules/user/user.service';

export interface Bindings {
  DB: D1Database;
  authKV: KVNamespace;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: 'development' | 'production';
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
}

export interface Variables {
  userId: string;
  services: {
    user: UserService;
    auth: AuthService;
  };
}

export interface AppContext {
  Bindings: Bindings;
  Variables: Variables;
}

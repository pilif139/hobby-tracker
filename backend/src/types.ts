import type { Logger } from 'lib';
import type { AuthService } from './modules/auth/auth.service';
import type { HobbyService } from './modules/hobby/hobby.service';
import type { HobbySessionService } from './modules/hobby-session/hobby-session.service';
import type { UserService } from './modules/user/user.service';

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
    hobby: HobbyService;
    hobbySession: HobbySessionService;
  };
  logger: Logger;
}

export interface AppContext {
  Bindings: Bindings;
  Variables: Variables;
}

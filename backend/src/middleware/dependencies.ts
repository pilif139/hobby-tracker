import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { AuthService } from '../modules/auth/auth.service';
import { createFollowService } from '../modules/follow/follow.factory';
import { createUserService } from '../modules/user/user.factory';
import { createHobbyService } from '@/src/modules/hobby/hobby.factory';
import { createHobbySessionService } from '@/src/modules/hobby-session/hobby-session.factory';
import type { AppContext } from '@/src/types';

type Services = AppContext['Variables']['services'];
type ServiceFactory<
  TServices extends Record<string, unknown>,
  K extends keyof TServices,
> = (
  context: Context<AppContext>,
  registry: DependencyRegistry<TServices>,
) => TServices[K];
type ServiceFactoryMap<TServices extends Record<string, unknown>> = {
  [K in keyof TServices]: ServiceFactory<TServices, K>;
};
type PartialServiceFactoryMap<TServices extends Record<string, unknown>> =
  Partial<ServiceFactoryMap<TServices>>;

/**
 * A simple dependency injection middleware for Hono that supports scoped and transient services.
 * Scoped services are instantiated once per request and shared across the request lifecycle, while transient services are instantiated every time they are accessed.
 */
class DependencyRegistry<TServices extends Record<string, unknown>> {
  private readonly cache = new Map<
    keyof TServices,
    TServices[keyof TServices]
  >();
  private readonly scopedFactories: PartialServiceFactoryMap<TServices>;
  private readonly transientFactories: PartialServiceFactoryMap<TServices>;

  constructor(
    private readonly context: Context<AppContext>,
    params: {
      scoped?: PartialServiceFactoryMap<TServices>;
      transient?: PartialServiceFactoryMap<TServices>;
    },
  ) {
    this.scopedFactories = params.scoped ?? {};
    this.transientFactories = params.transient ?? {};
  }

  getScoped<K extends keyof TServices>(key: K): TServices[K] | undefined {
    if (this.cache.has(key)) {
      return this.cache.get(key) as TServices[K];
    }

    const factory = this.scopedFactories[key];
    if (!factory) {
      return undefined;
    }

    const service = factory(this.context, this);
    this.cache.set(key, service);
    return service;
  }

  getTransient<K extends keyof TServices>(key: K): TServices[K] | undefined {
    const factory = this.transientFactories[key];
    return factory ? factory(this.context, this) : undefined;
  }
}

const createServicesObject = <TServices extends Record<string, unknown>>(
  registry: DependencyRegistry<TServices>,
  scopedFactories: PartialServiceFactoryMap<TServices>,
  transientFactories: PartialServiceFactoryMap<TServices>,
): TServices => {
  const services = {} as TServices;

  const defineGetter = (
    key: keyof TServices,
    resolver: (key: keyof TServices) => TServices[keyof TServices] | undefined,
  ) => {
    Object.defineProperty(services, key, {
      enumerable: true,
      configurable: false,
      get: () => resolver(key),
    });
  };

  (Object.keys(scopedFactories) as (keyof TServices)[]).forEach((key) => {
    defineGetter(key, (k) => registry.getScoped(k));
  });

  (Object.keys(transientFactories) as (keyof TServices)[]).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(services, key)) {
      return;
    }

    defineGetter(key, (k) => registry.getTransient(k));
  });

  return services;
};

const scopedServiceFactories: PartialServiceFactoryMap<Services> = {
  user: (c) => createUserService(c.env.DB, c.env.R2, c.env.R2_BUCKET_URL),
  auth: (c, registry) => {
    const userService = registry.getScoped('user');
    return new AuthService(
      userService ?? createUserService(c.env.DB, c.env.R2, c.env.R2_BUCKET_URL),
      c.env.authKV,
      c.env.ACCESS_TOKEN_SECRET,
      c.env.REFRESH_TOKEN_SECRET,
    );
  },
  hobby: (c) => createHobbyService(c.env.DB),
  hobbySession: (c) =>
    createHobbySessionService(c.env.DB, c.env.R2, c.env.R2_BUCKET_URL),
  follow: (c) => createFollowService(c.env.DB, c.env.R2),
};

const transientServiceFactories: PartialServiceFactoryMap<Services> = {};

export const dependencyMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const registry = new DependencyRegistry<Services>(c, {
      scoped: scopedServiceFactories,
      transient: transientServiceFactories,
    });
    c.set(
      'services',
      createServicesObject(
        registry,
        scopedServiceFactories,
        transientServiceFactories,
      ),
    );

    await next();
  },
);

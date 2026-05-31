import { sign } from 'hono/jwt';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '@/src/modules/auth/auth.service';
import type { UserService } from '@/src/modules/user/user.service';

type MemoryKV = KVNamespace & {
  __store: Map<string, string>;
};

const createMemoryKV = (): MemoryKV => {
  const store = new Map<string, string>();

  return {
    __store: store,
    get: vi.fn((key: string) => store.get(key) ?? null),
    put: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn((key: string) => {
      store.delete(key);
    }),
  } as unknown as MemoryKV;
};

const createUserServiceMock = () =>
  ({
    getByEmail: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  }) as unknown as UserService;

describe('AuthService (unit)', () => {
  it('returns null for malformed access token', async () => {
    const service = new AuthService(
      createUserServiceMock(),
      createMemoryKV(),
      'access-secret',
      'refresh-secret',
    );

    const result = await service.validateAccessToken('not-a-jwt');

    expect(result).toBeNull();
  });

  it('returns null for expired refresh token', async () => {
    const kv = createMemoryKV();
    const expiredToken = await sign(
      {
        userId: 'u1',
        token: 'refresh-token',
        exp: Math.floor(Date.now() / 1000) - 10,
        nbf: Math.floor(Date.now() / 1000) - 100,
        iat: Math.floor(Date.now() / 1000) - 100,
      },
      'refresh-secret',
      'HS256',
    );

    const service = new AuthService(
      createUserServiceMock(),
      kv,
      'access-secret',
      'refresh-secret',
    );

    const result = await service.validateRefreshToken(expiredToken);

    expect(result).toBeNull();
  });

  it('invalidates previously issued refresh token after new token generation', async () => {
    const kv = createMemoryKV();
    const service = new AuthService(
      createUserServiceMock(),
      kv,
      'access-secret',
      'refresh-secret',
    );

    const token1 = await service.generateRefreshToken('u1');
    const token2 = await service.generateRefreshToken('u1');

    const valid1 = await service.validateRefreshToken(token1);
    const valid2 = await service.validateRefreshToken(token2);

    expect(valid1).toBeNull();
    expect(valid2).not.toBeNull();
    expect(valid2?.userId).toBe('u1');
  });

  it('invalidates refresh token after explicit revoke', async () => {
    const kv = createMemoryKV();
    const service = new AuthService(
      createUserServiceMock(),
      kv,
      'access-secret',
      'refresh-secret',
    );

    const token = await service.generateRefreshToken('u1');
    await service.invalidateRefreshToken('u1');

    const valid = await service.validateRefreshToken(token);

    expect(valid).toBeNull();
    expect(kv.__store.has('userId:u1')).toBe(false);
  });

  it('concurrent refresh generation keeps only one valid token', async () => {
    const kv = createMemoryKV();
    const service = new AuthService(
      createUserServiceMock(),
      kv,
      'access-secret',
      'refresh-secret',
    );

    const [tokenA, tokenB] = await Promise.all([
      service.generateRefreshToken('u1'),
      service.generateRefreshToken('u1'),
    ]);

    const [validA, validB] = await Promise.all([
      service.validateRefreshToken(tokenA),
      service.validateRefreshToken(tokenB),
    ]);

    expect(validA).toBeNull();
    expect(validB).not.toBeNull();
  });
});

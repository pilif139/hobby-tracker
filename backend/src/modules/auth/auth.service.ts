import { sign, verify } from 'hono/jwt';
import type { CreateUserDto } from '../user/user.dto';
import authConfig from './auth.config';
import type { JWTRefreshToken, KVRefreshToken } from './auth.dto';
import { compareHash } from '@/src/lib/hash';
import type { UserService } from '@/src/modules/user/user.service';

export class AuthService {
  constructor(
    private userService: UserService,
    private authKV: KVNamespace,
    private ACCESS_TOKEN_SECRET: string,
    private REFRESH_TOKEN_SECRET: string,
  ) {}

  async register(user: CreateUserDto) {
    const exists = await this.userService.getByEmail(user.email);
    if (exists) {
      throw new Error('User with this email already exists');
    }

    const createdUser = await this.userService.create(user);

    let accessToken, refreshToken;
    try {
      accessToken = await this.generateAccessToken(createdUser.id);
      refreshToken = await this.generateRefreshToken(createdUser.id);
    } catch (error) {
      await this.userService.delete(createdUser.id);
      throw new Error('Failed to generate tokens: ' + (error as Error).message);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      return false;
    }
    const passwordMatches = await compareHash(password, user.password);
    if (!passwordMatches) {
      return false;
    }

    const tokenInKV = await this.authKV.get(`userId:${user.id}`);
    const refreshToken = await this.generateRefreshToken(
      user.id,
      tokenInKV
        ? (JSON.parse(tokenInKV) as KVRefreshToken).refreshToken
        : undefined,
    );

    return {
      accessToken: await this.generateAccessToken(user.id),
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logoutFromOtherDevices(userId: string, refreshToken: string) {
    // check if user hasn't logged out from other devices using other device before
    const validToken = await this.validateRefreshToken(refreshToken);
    if (!validToken) {
      throw new Error('Invalid refresh token');
    }

    return {
      accessToken: await this.generateAccessToken(userId),
      refreshToken: await this.generateRefreshToken(userId),
    };
  }

  async generateRefreshToken(userId: string, token?: string) {
    const randomToken =
      token ?? crypto.getRandomValues(new Uint8Array(32)).join('');
    await this.authKV.put(
      `userId:${userId}`,
      JSON.stringify({ refreshToken: randomToken }),
      {
        expirationTtl: authConfig.refreshTokenExpirationTime,
      },
    );

    const refreshToken = await this.createJWT(
      {
        userId,
        token: randomToken,
      },
      authConfig.refreshTokenExpirationTime,
      this.REFRESH_TOKEN_SECRET,
    );
    return refreshToken;
  }

  async generateAccessToken(userId: string) {
    const accessToken = await this.createJWT(
      {
        userId,
      },
      authConfig.accessTokenExpirationTime,
      this.ACCESS_TOKEN_SECRET,
    );

    return accessToken;
  }

  async validateAccessToken(token: string) {
    try {
      const decodedPayload = (await verify(token, this.ACCESS_TOKEN_SECRET, {
        alg: 'HS256',
      })) as unknown as { userId: string };
      return decodedPayload.userId;
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string) {
    try {
      const decodedPayload = (await verify(token, this.REFRESH_TOKEN_SECRET, {
        alg: 'HS256',
      })) as unknown as JWTRefreshToken;

      const storedToken = await this.authKV.get(
        `userId:${decodedPayload.userId}`,
      );
      const parsed = JSON.parse(storedToken ?? '') as KVRefreshToken;
      if (parsed.refreshToken !== decodedPayload.token) {
        return null;
      }

      return decodedPayload;
    } catch {
      return null;
    }
  }

  private async createJWT(
    payload: Record<string, unknown>,
    expiresIn: number,
    secret: string,
  ) {
    return sign(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      'HS256',
    );
  }
}

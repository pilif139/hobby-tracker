import { EmailMessage } from 'cloudflare:email';
import { sign, verify } from 'hono/jwt';
import { createMimeMessage } from 'mimetext';
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
    private SEND_EMAIL?: SendEmail,
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

  async invalidateRefreshToken(userId: string) {
    await this.authKV.delete(`userId:${userId}`);
  }

  async generatePasswordResetToken(userId: string) {
    const token = crypto.getRandomValues(new Uint8Array(32)).join('');

    // Store token with 1 hour expiration
    await this.authKV.put(`passwordReset:${token}`, userId, {
      expirationTtl: 3600,
    });

    return token;
  }

  async validatePasswordResetToken(token: string) {
    const userId = await this.authKV.get(`passwordReset:${token}`);
    return userId;
  }

  async invalidatePasswordResetToken(token: string) {
    await this.authKV.delete(`passwordReset:${token}`);
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

  async sendPasswordResetEmail(email: string, resetLink: string) {
    if (!this.SEND_EMAIL) {
      throw new Error('SEND_EMAIL binding is not configured.');
    }

    const msg = createMimeMessage();
    msg.setSender({ name: 'Hobby Tracker', addr: 'noreply@your-domain.com' }); // TODO: configure mail in cloudflare dashboard
    msg.setRecipient(email);
    msg.setSubject('Password Reset Request');
    msg.addMessage({
      contentType: 'text/plain',
      data: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    const messageContent = msg.asRaw();
    const rawEmail = new EmailMessage(
      'noreply@your-domain.com', // TODO: Replace with actual domain sender
      email,
      messageContent,
    );

    await this.SEND_EMAIL.send(rawEmail);
  }
}

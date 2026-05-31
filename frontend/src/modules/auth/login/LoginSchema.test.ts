import { describe, expect, it } from 'vitest';
import LoginSchema from './LoginSchema';

describe('LoginSchema', () => {
  it('accepts valid email and password', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === 'Invalid email address',
        ),
      ).toBe(true);
    }
  });

  it('rejects short and too-long passwords', () => {
    const short = LoginSchema.safeParse({
      email: 'a@b.com',
      password: 'short',
    });
    expect(short.success).toBe(false);

    const longPwd = 'x'.repeat(200);
    const long = LoginSchema.safeParse({ email: 'a@b.com', password: longPwd });
    expect(long.success).toBe(false);
  });
});

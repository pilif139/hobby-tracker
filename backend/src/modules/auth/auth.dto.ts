import z from 'zod';

export const UsernameSchema = z
  .string({
    error: 'Username must be a string',
  })
  .min(2, {
    error: 'Username must be at least 2 characters long',
  })
  .max(100, {
    error: 'Username must be at most 100 characters long',
  });
export const UserPasswordSchema = z
  .string({
    error: 'Password must be a string',
  })
  .min(8, {
    error: 'Password must be at least 8 characters long',
  })
  .max(128, {
    error: 'Password must be at most 128 characters long',
  });

export const RegisterSchema = z.object({
  email: z.email({
    error: 'Invalid email address',
  }),
  name: UsernameSchema,
  password: UserPasswordSchema,
});

export const LoginSchema = z.object({
  email: z.email({
    error: 'Invalid email address',
  }),
  password: UserPasswordSchema,
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;

export interface KVRefreshToken {
  refreshToken: string;
}
export interface JWTRefreshToken {
  userId: string;
  token: string;
}

import { z } from 'zod';
import type { Prisma } from '@/prisma/generated/client';
import { UsernameSchema } from '@/src/modules/auth/auth.dto';

export const userResponseSelect = {
  id: true,
  email: true,
  name: true,
  password: true,
} as const satisfies Prisma.UserSelect;

export const UserProfileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
  followedByCount: z.number(),
  followsCount: z.number(),
  hobbiesCount: z.number(),
  hobbySessionsCount: z.number(),
});

export const UserSafeSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
});

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(128),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

// TODO: add secure email and password update handling
export const UpdateUserSchema = z.object({
  // email: z
  //   .email({
  //     error: 'Invalid email address',
  //   })
  //   .optional(),
  name: UsernameSchema.optional(),
  // password: UserPasswordSchema.optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

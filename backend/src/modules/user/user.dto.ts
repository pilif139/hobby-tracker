import { z } from 'zod';
import type { Prisma } from '@/prisma/generated/client';

export const userResponseSelect = {
  id: true,
  email: true,
  name: true,
} as const satisfies Prisma.UserSelect;

export const userWithHobbiesSelect = {
  id: true,
  email: true,
  name: true,
  hobbies: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
} as const satisfies Prisma.UserSelect;

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof userResponseSelect;
}>;

export type UserWithHobbies = Prisma.UserGetPayload<{
  select: typeof userWithHobbiesSelect;
}>;

export const UserResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
}) satisfies z.ZodType<UserResponse>;

export type UserResponseDto = z.infer<typeof UserResponseSchema>;

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(128),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(128).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const DeleteUserSchema = z.object({
  id: z.uuid(),
});

export type DeleteUserDto = z.infer<typeof DeleteUserSchema>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

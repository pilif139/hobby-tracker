import { z } from 'zod';
import type { Prisma } from '@/prisma/generated/client';
import { UsernameSchema } from '@/src/modules/auth/auth.dto';

export const userResponseSelect = {
  id: true,
  email: true,
  name: true,
  password: true,
} as const satisfies Prisma.UserSelect;

export const userSafeSelect = {
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

export type UserSafe = Prisma.UserGetPayload<{
  select: typeof userSafeSelect;
}>;

export const UserResponseSchema = z.object<UserResponse>();

export const UserSafeSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
});

export type UserWithHobbies = Prisma.UserGetPayload<{
  select: typeof userWithHobbiesSelect;
}>;

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

export const DeleteUserSchema = z.object({
  id: z.uuid(),
});

export type DeleteUserDto = z.infer<typeof DeleteUserSchema>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

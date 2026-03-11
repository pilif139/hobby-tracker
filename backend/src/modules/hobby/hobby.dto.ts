import z from 'zod';
import type { Prisma } from '@/prisma/generated/client';

export const hobbyResponseSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      users: true,
    },
  },
} as const satisfies Prisma.HobbySelect;

export type HobbyResponse = Prisma.HobbyGetPayload<{
  select: typeof hobbyResponseSelect;
}>;

export const HobbyResponseSchema = z.object<HobbyResponse>();

export const createHobbySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(1000).optional(),
});

export type CreateHobbyDto = z.infer<typeof createHobbySchema>;

export const updateHobbySchema = createHobbySchema.partial();

export type UpdateHobbyDto = z.infer<typeof updateHobbySchema>;

export const DeleteHobbySchema = z.object({
  id: z.uuid(),
});

export type DeleteHobbyDto = z.infer<typeof DeleteHobbySchema>;

export type CreateHobbyInput = Prisma.HobbyCreateWithoutHobbySessionsInput;

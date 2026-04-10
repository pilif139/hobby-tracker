import z from 'zod';

export const followDto = z.object({
  followerId: z.string(),
  followingId: z.string(),
});

export const followResponseSchema = z.object({
  success: z.boolean(),
});

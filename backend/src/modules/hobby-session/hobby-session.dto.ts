import z from 'zod';

const imagesField = z.array(z.instanceof(File)).max(4);

const deletedImageKeysField = z.array(z.string());

export const createHobbySessionDto = z.object({
  hobbyId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
  images: imagesField.optional(),
});

export const updateHobbySessionDto = z.object({
  hobbyId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  notes: z.string().nullable().optional(),
  images: imagesField.optional(),
  deletedImageKeys: deletedImageKeysField.optional(),
});

export const hobbySessionQueryDto = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const hobbySessionStatsSchema = z.object({
  totalCount: z.number(),
  totalDurationInSeconds: z.number(),
  averageDurationInSeconds: z.number(),
  minDurationInSeconds: z.number(),
  maxDurationInSeconds: z.number(),
  activeDaysCount: z.number(),
  currentStreakDays: z.number(),
  longestStreakDays: z.number(),
  sessionsLast7Days: z.number(),
  sessionsLast30Days: z.number(),
  totalDurationLast7DaysInSeconds: z.number(),
  totalDurationLast30DaysInSeconds: z.number(),
});

export const hobbySessionResponseSchema = z.object({
  id: z.string(),
  hobbyId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const hobbySessionListResponseSchema = z.object({
  sessions: z.array(hobbySessionResponseSchema),
  stats: hobbySessionStatsSchema,
});

export const hobbySessionSingleResponseSchema = z.object({
  session: hobbySessionResponseSchema,
  stats: hobbySessionStatsSchema,
});

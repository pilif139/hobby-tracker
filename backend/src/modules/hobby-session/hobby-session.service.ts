import { PhotonImage } from '@cf-wasm/photon';
import type { HobbySessionRepository } from './hobby-session.repository';
import { resizeImage } from '@/src/lib/image';

const SESSION_IMAGE_MAX_WIDTH = 1280;
const SESSION_IMAGE_MAX_HEIGHT = 720;
const SESSION_IMAGE_MAX_COUNT = 4;

interface CreateHobbySessionInput {
  startTime: Date | string;
  endTime: Date | string;
  durationInSeconds?: number | null;
  notes?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  hobbyId: string;
  userId: string;
  images?: File[];
}

interface UpdateHobbySessionInput {
  startTime?: Date | string;
  endTime?: Date | string;
  durationInSeconds?: number | null;
  notes?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  hobbyId?: string;
  newImages?: File[];
  deletedImageKeys?: string[];
}

interface SessionStats {
  totalCount: number;
  totalDurationInSeconds: number;
  averageDurationInSeconds: number;
  minDurationInSeconds: number;
  maxDurationInSeconds: number;
  activeDaysCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  sessionsLast7Days: number;
  sessionsLast30Days: number;
  totalDurationLast7DaysInSeconds: number;
  totalDurationLast30DaysInSeconds: number;
}

interface SessionListFilters {
  limit?: number;
  offset?: number;
  from?: Date;
  to?: Date;
}

export class TooManySessionImagesException extends Error {
  constructor(max: number) {
    super(`A session can have at most ${max} images.`);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HobbySessionService {
  constructor(
    private readonly hobbySessionRepository: HobbySessionRepository,
    private readonly BUCKET_URL: string,
  ) {}

  private mapFilesToUrls(files: { storageObjectKey: string }[]): string[] {
    return files.map((f) => `${this.BUCKET_URL}/${f.storageObjectKey}`);
  }

  private async processImage(
    file: File,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    const image = PhotonImage.new_from_byteslice(originalBuffer);
    const originalWidth = image.get_width();
    const originalHeight = image.get_height();
    image.free();

    if (
      originalWidth <= SESSION_IMAGE_MAX_WIDTH &&
      originalHeight <= SESSION_IMAGE_MAX_HEIGHT
    ) {
      return { buffer: originalBuffer, filename: file.name };
    }

    const scale = Math.min(
      SESSION_IMAGE_MAX_WIDTH / originalWidth,
      SESSION_IMAGE_MAX_HEIGHT / originalHeight,
    );
    const targetWidth = Math.max(1, Math.floor(originalWidth * scale));
    const targetHeight = Math.max(1, Math.floor(originalHeight * scale));

    const buffer = resizeImage(originalBuffer, targetWidth, targetHeight);
    return { buffer, filename: file.name };
  }

  private async uploadImages(
    sessionId: string,
    userId: string,
    images: File[],
  ): Promise<void> {
    for (const image of images) {
      const { buffer, filename } = await this.processImage(image);
      await this.hobbySessionRepository.uploadSessionFile(
        sessionId,
        userId,
        buffer,
        filename,
      );
    }
  }

  private getStreakStats(dayKeys: string[]) {
    if (dayKeys.length === 0) {
      return {
        activeDaysCount: 0,
        currentStreakDays: 0,
        longestStreakDays: 0,
      };
    }

    const dayMsList = dayKeys.map((dayKey) =>
      new Date(`${dayKey}T00:00:00.000Z`).getTime(),
    );

    let longestStreakDays = 1;
    let runningStreak = 1;

    for (let i = 1; i < dayMsList.length; i++) {
      const currentDayMs = dayMsList[i];
      const previousDayMs = dayMsList[i - 1];
      if (currentDayMs === undefined || previousDayMs === undefined) {
        continue;
      }

      const diffInDays = (currentDayMs - previousDayMs) / 86_400_000;
      if (diffInDays === 1) {
        runningStreak += 1;
        longestStreakDays = Math.max(longestStreakDays, runningStreak);
      } else {
        runningStreak = 1;
      }
    }

    let currentStreakDays = 1;
    for (let i = dayMsList.length - 1; i > 0; i--) {
      const currentDayMs = dayMsList[i];
      const previousDayMs = dayMsList[i - 1];
      if (currentDayMs === undefined || previousDayMs === undefined) {
        continue;
      }

      const diffInDays = (currentDayMs - previousDayMs) / 86_400_000;
      if (diffInDays === 1) {
        currentStreakDays += 1;
      } else {
        break;
      }
    }

    return {
      activeDaysCount: dayKeys.length,
      currentStreakDays,
      longestStreakDays,
    };
  }

  private async getStats(
    userId: string,
    hobbyId?: string,
    from?: Date,
    to?: Date,
  ): Promise<SessionStats> {
    const [aggregates, distinctDayKeys] = await Promise.all([
      this.hobbySessionRepository.getAnalytics({
        userId,
        hobbyId,
        from,
        to,
      }),
      this.hobbySessionRepository.getDistinctSessionDays({
        userId,
        hobbyId,
        from,
        to,
      }),
    ]);

    const streakStats = this.getStreakStats(distinctDayKeys);

    return {
      totalCount: aggregates.totalCount,
      totalDurationInSeconds: aggregates.totalDurationInSeconds,
      averageDurationInSeconds: aggregates.averageDurationInSeconds,
      minDurationInSeconds: aggregates.minDurationInSeconds,
      maxDurationInSeconds: aggregates.maxDurationInSeconds,
      activeDaysCount: aggregates.activeDaysCount,
      currentStreakDays: streakStats.currentStreakDays,
      longestStreakDays: streakStats.longestStreakDays,
      sessionsLast7Days: aggregates.sessionsLast7Days,
      sessionsLast30Days: aggregates.sessionsLast30Days,
      totalDurationLast7DaysInSeconds:
        aggregates.totalDurationLast7DaysInSeconds,
      totalDurationLast30DaysInSeconds:
        aggregates.totalDurationLast30DaysInSeconds,
    };
  }

  async findById(id: string) {
    return this.hobbySessionRepository.findById(id);
  }

  async getById(id: string) {
    const session = await this.hobbySessionRepository.findByIdWithFiles(id);
    if (!session) {
      return null;
    }
    const { files, ...rest } = session;
    return { ...rest, imageUrls: this.mapFilesToUrls(files) };
  }

  async findByHobbyId(hobbyId: string) {
    return this.hobbySessionRepository.findByHobbyId(hobbyId);
  }

  async findByHobbyIdAndUserId(
    hobbyId: string,
    userId: string,
    filters?: SessionListFilters,
  ) {
    const sessions = await this.hobbySessionRepository.findByHobbyIdAndUserId(
      hobbyId,
      userId,
      filters?.from,
      filters?.to,
    );
    const stats = await this.getStats(
      userId,
      hobbyId,
      filters?.from,
      filters?.to,
    );

    return {
      sessions: sessions.map(({ files, ...session }) => ({
        ...session,
        imageUrls: this.mapFilesToUrls(files),
      })),
      stats,
    };
  }

  async findByUserIdPaginatedWithStats(
    userId: string,
    filters?: SessionListFilters,
  ) {
    const sessions = await this.hobbySessionRepository.findByUserIdPaginated(
      userId,
      filters?.limit ?? 10,
      filters?.offset ?? 0,
      filters?.from,
      filters?.to,
    );
    const stats = await this.getStats(
      userId,
      undefined,
      filters?.from,
      filters?.to,
    );

    return {
      sessions: sessions.map(({ files, ...session }) => ({
        ...session,
        imageUrls: this.mapFilesToUrls(files),
      })),
      stats,
    };
  }

  async create(data: CreateHobbySessionInput) {
    const { hobbyId, userId, images, ...rest } = data;

    const session = await this.hobbySessionRepository.create({
      ...rest,
      hobby: { connect: { id: hobbyId } },
      user: { connect: { id: userId } },
    });

    if (images?.length) {
      console.log('Uploading images of the hobby session:');
      console.log('images.length:', images.length);
      console.log('images:', images);
      await this.uploadImages(session.id, userId, images);
    }

    return this.getById(session.id);
  }

  async update(id: string, userId: string, data: UpdateHobbySessionInput) {
    const { hobbyId, newImages, deletedImageKeys, ...rest } = data;

    if (newImages?.length || deletedImageKeys?.length) {
      const current = await this.hobbySessionRepository.findByIdWithFiles(id);
      const currentCount = current?.files.length ?? 0;
      const afterDelete = currentCount - (deletedImageKeys?.length ?? 0);
      const afterAdd = afterDelete + (newImages?.length ?? 0);

      if (afterAdd > SESSION_IMAGE_MAX_COUNT) {
        throw new TooManySessionImagesException(SESSION_IMAGE_MAX_COUNT);
      }
    }

    if (deletedImageKeys?.length) {
      await this.hobbySessionRepository.deleteSessionFiles(
        id,
        deletedImageKeys,
      );
    }

    await this.hobbySessionRepository.update(id, {
      ...rest,
      ...(hobbyId ? { hobby: { connect: { id: hobbyId } } } : {}),
    });

    if (newImages?.length) {
      await this.uploadImages(id, userId, newImages);
    }

    return this.getById(id);
  }

  async delete(id: string) {
    return this.hobbySessionRepository.delete(id);
  }
}

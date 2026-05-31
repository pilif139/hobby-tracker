import type { FeedRepository, FeedSessionRow } from './feed.repository';
import type { FollowService } from '@/src/modules/follow/follow.service';

const PERIOD_DAYS = { week: 7, month: 30 } as const;

export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly followService: FollowService,
    private readonly BUCKET_URL: string,
  ) {}

  private fileKeyToUrl(key: string): string {
    return `${this.BUCKET_URL}/${key}`;
  }

  private avatarUrl(key: string | null): string | null {
    return key ? this.fileKeyToUrl(key) : null;
  }

  private mapFeedSession(session: FeedSessionRow) {
    return {
      id: session.id,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      notes: session.notes,
      imageUrls: session.files.map((f) =>
        this.fileKeyToUrl(f.storageObjectKey),
      ),
      createdAt: session.createdAt.toISOString(),
      user: {
        id: session.user.id,
        name: session.user.name,
        avatarUrl: this.avatarUrl(session.user.avatarFileKey),
      },
      hobby: {
        id: session.hobby.id,
        name: session.hobby.name,
      },
    };
  }

  async getFeed(userId: string, limit: number = 20, cursor?: string) {
    const followedUserIds = await this.followService.getFollowingIds(userId);

    let cursorData: { createdAt: Date; id: string } | undefined;
    if (cursor) {
      cursorData =
        (await this.feedRepository.getSessionById(cursor)) ?? undefined;
    }

    const fetchLimit = limit + 1;
    const userIds = [...followedUserIds, userId];
    const sessions = await this.feedRepository.getFeedSessions(
      userIds,
      fetchLimit,
      cursorData,
    );

    const hasMore = sessions.length > limit;
    const resultSessions = hasMore ? sessions.slice(0, limit) : sessions;

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = resultSessions[resultSessions.length - 1];
      if (last) {
        nextCursor = last.id;
      }
    }

    return {
      sessions: resultSessions.map((s) => this.mapFeedSession(s)),
      nextCursor,
    };
  }

  async getHobbyBasedFollowSuggestions(userId: string, limit: number = 5) {
    const followedUserIds = await this.followService.getFollowingIds(userId);

    const suggestions =
      await this.feedRepository.getHobbyBasedFollowSuggestions(
        userId,
        followedUserIds,
        limit,
      );

    return {
      suggestions: suggestions.map((s) => ({
        id: s.id,
        name: s.name,
        avatarUrl: this.avatarUrl(s.avatarFileKey),
        sharedHobbyCount: s.sharedHobbyCount,
        sharedHobbies: s.sharedHobbies,
      })),
    };
  }

  async getSocialBasedFollowSuggestions(userId: string, limit: number = 5) {
    const followedUserIds = await this.followService.getFollowingIds(userId);

    const suggestions =
      await this.feedRepository.getSocialBasedFollowSuggestions(
        userId,
        followedUserIds,
        limit,
      );

    return {
      suggestions: suggestions.map((s) => ({
        id: s.id,
        name: s.name,
        avatarUrl: this.avatarUrl(s.avatarFileKey),
        mutualConnectionCount: s.mutualConnectionCount,
      })),
    };
  }

  async getTrendingHobbySuggestions(
    userId: string,
    period: 'week' | 'month' = 'week',
    limit: number = 5,
  ) {
    const periodDays = PERIOD_DAYS[period];
    const suggestions = await this.feedRepository.getTrendingHobbySuggestions(
      userId,
      periodDays,
      limit,
    );

    return { suggestions };
  }
}

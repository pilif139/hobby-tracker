import type { UserRepository } from '../user/user.repository';
import type { FollowRepository } from './follow.repository';

export class FollowUserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FollowUserNotFoundError';
  }
}

export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  private async getMissingUserIds(...userIds: string[]) {
    const userChecks = await Promise.all(
      userIds.map(async (id) => ({
        id,
        exists: await this.userRepository.exists(id),
      })),
    );

    return userChecks
      .filter((userCheck) => !userCheck.exists)
      .map((userCheck) => userCheck.id);
  }

  private async assertUsersExist(...userIds: string[]) {
    const missingUserIds = await this.getMissingUserIds(...userIds);
    if (missingUserIds.length > 0) {
      throw new FollowUserNotFoundError('One or both users do not exist');
    }
  }

  async followUser(followerId: string, followingId: string) {
    await this.assertUsersExist(followerId, followingId);
    return this.followRepository.create(followerId, followingId);
  }

  async unfollowUser(followerId: string, followingId: string) {
    await this.assertUsersExist(followerId, followingId);
    return this.followRepository.delete(followerId, followingId);
  }

  async getFollowing(userId: string) {
    await this.assertUsersExist(userId);
    return this.followRepository.findByFollowerId(userId);
  }

  async getFollowers(userId: string) {
    await this.assertUsersExist(userId);
    return this.followRepository.findByFollowingId(userId);
  }

  async getFollowCounts(userId: string) {
    await this.assertUsersExist(userId);
    return this.followRepository.getFollowCounts(userId);
  }
}

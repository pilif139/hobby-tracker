import type { CreateHobbyDto, UpdateHobbyDto } from './hobby.dto';
import type { HobbyRepository } from './hobby.repository';

export class HobbyService {
  constructor(private readonly hobbyRepository: HobbyRepository) {}

  async search(search: string, limit: number = 10, offset: number = 0) {
    return this.hobbyRepository.search(search, {
      limit,
      offset,
    });
  }

  async getById(id: string) {
    return this.hobbyRepository.findById(id);
  }

  async getByUserId(userId: string) {
    const hobbies = await this.hobbyRepository.findByUserId(userId);
    return hobbies.map(({ _count, ...hobby }) => ({
      ...hobby,
      sessionCount: _count.hobbySessions,
    }));
  }

  async getAll() {
    return this.hobbyRepository.findAll();
  }

  async create(data: CreateHobbyDto) {
    return this.hobbyRepository.create(data);
  }

  async update(id: string, data: UpdateHobbyDto) {
    const exists = await this.hobbyRepository.exists(id);
    if (!exists) {
      return null;
    }

    return this.hobbyRepository.update(id, data);
  }

  async delete(id: string) {
    return this.hobbyRepository.delete(id);
  }

  async addToProfile(userId: string, hobbyId: string) {
    const exists = await this.hobbyRepository.exists(hobbyId);
    if (!exists) {
      return { error: 'Hobby not found' } as const;
    }

    const alreadyLinked = await this.hobbyRepository.isUserLinkedToHobby(
      userId,
      hobbyId,
    );
    if (alreadyLinked) {
      return { error: 'Hobby already in profile' } as const;
    }

    await this.hobbyRepository.addUserToHobby(userId, hobbyId);
    return { success: true } as const;
  }

  async removeFromProfile(userId: string, hobbyId: string) {
    const exists = await this.hobbyRepository.exists(hobbyId);
    if (!exists) {
      return { error: 'Hobby not found' } as const;
    }

    const isLinked = await this.hobbyRepository.isUserLinkedToHobby(
      userId,
      hobbyId,
    );
    if (!isLinked) {
      return { error: 'Hobby not in profile' } as const;
    }

    await this.hobbyRepository.removeUserFromHobby(userId, hobbyId);
    return { success: true } as const;
  }
}

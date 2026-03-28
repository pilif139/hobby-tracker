import type { HobbySessionRepository } from './hobby-session.repository';
import type { Prisma } from '@/prisma/generated/client';

export class HobbySessionService {
  constructor(
    private readonly hobbySessionRepository: HobbySessionRepository,
  ) {}

  async findById(id: string) {
    return this.hobbySessionRepository.findById(id);
  }

  async findByHobbyId(hobbyId: string) {
    return this.hobbySessionRepository.findByHobbyId(hobbyId);
  }

  async findByUserIdPaginated(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    return this.hobbySessionRepository.findByUserIdPaginated(
      userId,
      limit,
      offset,
    );
  }

  async create(data: Prisma.HobbySessionCreateInput) {
    return this.hobbySessionRepository.create(data);
  }

  async update(id: string, data: Prisma.HobbySessionUpdateInput) {
    return this.hobbySessionRepository.update(id, data);
  }

  async delete(id: string) {
    return this.hobbySessionRepository.delete(id);
  }
}

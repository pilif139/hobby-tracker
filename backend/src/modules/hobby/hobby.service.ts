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
}

import type { CreateUserDto, UpdateUserDto } from './user.dto';
import { createHash } from '@/src/lib/hash';
import type { UserRepository } from '@/src/modules/user/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string) {
    return this.userRepository.findById(id);
  }

  async getProfileById(id: string) {
    return this.userRepository.findProfileById(id);
  }

  async getByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await createHash(data.password);

    return this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      return null;
    }

    return this.userRepository.update(id, {
      name: data.name,
    });
  }

  async delete(id: string) {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }

  async exists(id: string) {
    return this.userRepository.exists(id);
  }

  async emailExists(email: string) {
    return this.userRepository.emailExists(email);
  }
}

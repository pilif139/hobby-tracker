import type { CreateUserDto, UpdateUserDto } from './user.dto';
import { createHash } from '@/src/lib/hash';
import type { UserRepository } from '@/src/modules/user/user.repository';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly BUCKET_URL: string,
  ) {}

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
    return this.userRepository.update(id, {
      name: data.name,
    });
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async uploadAvatar(userId: string, avatar: File) {
    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const avatarKey = await this.userRepository.updateAvatar(
      userId,
      avatar.name,
      buffer,
    );

    return `${this.BUCKET_URL}/${avatarKey}`;
  }
}

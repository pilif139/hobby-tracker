import type {
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
  UserWithHobbies,
} from '@/src/modules/user/user.dto';
import type { UserRepository } from '@/src/modules/user/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<UserResponse | null> {
    return this.userRepository.findById(id);
  }

  async getByIdWithHobbies(id: string): Promise<UserWithHobbies | null> {
    return this.userRepository.findByIdWithHobbies(id);
  }

  async getAll(): Promise<UserResponse[]> {
    return this.userRepository.findAll();
  }

  async getByEmail(email: string): Promise<UserResponse | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto): Promise<UserResponse> {
    return this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponse | null> {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      return null;
    }

    return this.userRepository.update(id, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async delete(id: string): Promise<boolean> {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }

  async exists(id: string): Promise<boolean> {
    return this.userRepository.exists(id);
  }

  async emailExists(email: string): Promise<boolean> {
    return this.userRepository.emailExists(email);
  }
}

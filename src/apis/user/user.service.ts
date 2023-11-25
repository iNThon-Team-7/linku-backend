import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user).save();
  }

  async checkDuplicationEmail(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !user;
  }

  async updateUserToken(id: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async updateUserUuid(id: number, uuid: string): Promise<void> {
    await this.userRepository.update(id, { uuid });
  }

  async certifyUser(id: number): Promise<void> {
    await this.userRepository.update(id, { certified: true });
  }
}

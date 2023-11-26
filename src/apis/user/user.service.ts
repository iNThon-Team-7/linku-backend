import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Role } from 'src/lib/enums';
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

  async getUserWithTagsById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        subscriptions: { tag: true },
      },
    });
  }

  async getUsersByTagId(tagId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { subscriptions: { tagId } },
    });
  }

  async getUserByIdOrFail(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
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

  async updateUserRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async updateUserFcmToken(id: number, fcmToken: string): Promise<void> {
    await this.userRepository.update(id, { fcmToken });
  }

  async certifyUser(id: number): Promise<void> {
    await this.userRepository.update(id, { role: Role.USER });
  }

  async updateUserProfile(id: number, profile: Partial<User>): Promise<void> {
    await this.userRepository.update(id, profile);
  }

  async updateUserImage(id: number, image: Buffer): Promise<void> {
    await this.userRepository.update(id, { image });
  }
}

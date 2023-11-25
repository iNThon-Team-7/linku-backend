import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, Tag } from 'src/entities';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async getTags(): Promise<Tag[]> {
    return this.tagRepository.find({ order: { id: 'ASC' } });
  }

  async getTagByIdOrFail(id: number): Promise<Tag> {
    return this.tagRepository.findOneOrFail({ where: { id } });
  }

  async getSubscription(
    options: FindOptionsWhere<Subscription>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.findOne({ where: { ...options } });
  }

  async addSubscription(subscription: Partial<Subscription>): Promise<void> {
    await this.subscriptionRepository.create(subscription).save();
  }

  async removeSubscription(subscription: Subscription): Promise<void> {
    await this.subscriptionRepository.remove(subscription);
  }
}

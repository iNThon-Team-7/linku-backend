import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meet, Comment } from 'src/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuthUser } from 'src/lib/decorators/auth.user.decorator';
import { FindOptionsPage } from 'src/lib/utils/pagination.util';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet)
    private readonly meetRepository: Repository<Meet>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getMeets(
    where: FindOptionsWhere<Meet> | FindOptionsWhere<Meet>[],
    page: FindOptionsPage,
  ): Promise<Meet[]> {
    return this.meetRepository.find({
      where,
      order: { createdAt: 'DESC' },
      ...page,
      relations: { host: {}, tag: {} },
    });
  }

  async getMeetById(id: number): Promise<Meet> {
    return this.meetRepository.findOne({
      where: { id },
      relations: { host: {}, tag: {}, participations: { user: {} } },
    });
  }

  async getComment(@AuthUser() user, meetId: number): Promise<Comment[]> {
    const { id: userId } = user;
    return this.commentRepository.find({
      where: {
        meetId,
        userId,
      },
    });
  }
}

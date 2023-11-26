import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meet, Comment, Participation } from 'src/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindOptionsPage } from 'src/lib/utils/pagination.util';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet)
    private readonly meetRepository: Repository<Meet>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
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

  async getCommentsByMeetId(meetId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { meetId },
      relations: { user: {} },
    });
  }

  async addMeet(meet: Partial<Meet>): Promise<Meet> {
    return this.meetRepository.create(meet).save();
  }

  async addComment(comment: Partial<Comment>): Promise<void> {
    await this.commentRepository.create(comment).save();
  }

  async addParticipation(participation: Partial<Participation>): Promise<void> {
    await this.participationRepository.create(participation).save();
  }
}

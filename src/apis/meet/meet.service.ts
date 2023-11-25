import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meet, Comment } from 'src/entities';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuthUser } from 'src/lib/decorators/auth.user.decorator';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet)
    private readonly meetRepository: Repository<Meet>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getMeets(@AuthUser() user, isTag): Promise<Meet[]> {
    const { age, gender } = user;
    const tagCompare = isTag ? user.tag : undefined;
    return this.meetRepository.find({
      where: {
        meetTime: MoreThanOrEqual(new Date()),
        minAge: MoreThanOrEqual(age),
        maxAge: LessThanOrEqual(age),
        gender: gender,
        id: user.id,
        tag: tagCompare,
      },
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

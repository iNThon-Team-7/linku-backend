import { Comment } from '../../entities/comment.entity';
import { UserResponseDto } from '../user';

export class MeetCommentResponseDto {
  id: number;
  user: UserResponseDto;
  body: string;
  createdAt: Date;

  static of(comment: Comment): MeetCommentResponseDto {
    const { id, user, body, createdAt } = comment;
    return { id, user: UserResponseDto.of(user), body, createdAt };
  }
}

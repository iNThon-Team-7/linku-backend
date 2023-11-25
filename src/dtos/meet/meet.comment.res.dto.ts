import { Comment } from '../../entities/comment.entity';

export class MeetCommentResponseDto {
  id: number;
  userId: number;
  meetId: number;
  body: string;
  createdAt: Date;

  static of(comment: Comment): MeetCommentResponseDto {
    const { id, userId, meetId, body, createdAt } = comment;
    return { id, userId, meetId, body, createdAt };
  }
}

import { IsString } from 'class-validator';

export class MeetCommentRequestDto {
  @IsString()
  body: string;
}

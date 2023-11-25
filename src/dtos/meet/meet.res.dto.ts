import { Meet } from 'src/entities';
import { TagResponseDto } from '../tag';
import { UserResponseDto } from '../user';

export class MeetResponseDto {
  id: number;
  host: UserResponseDto;
  title: string;
  meetTime: Date;
  tag: TagResponseDto;

  static of(meet: Meet): MeetResponseDto {
    const { id, host, title, meetTime, tag } = meet;

    return {
      id,
      host: UserResponseDto.of(host),
      title,
      meetTime,
      tag: TagResponseDto.of(tag),
    };
  }
}

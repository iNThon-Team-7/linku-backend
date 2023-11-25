import { Meet } from 'src/entities';
import { MeetResponseDto } from './meet.res.dto';
import { Gender } from 'src/lib/enums';
import { UserResponseDto } from '../user';

export class MeetDetailResponseDto extends MeetResponseDto {
  body: string;
  maxParticipants: number;
  isOnline: boolean;
  location: string;
  minAge: number;
  maxAge: number;
  gender: Gender;
  createdAt: Date;
  participants: UserResponseDto[];

  static of(meet: Meet): MeetDetailResponseDto {
    const {
      body,
      maxParticipants,
      isOnline,
      location,
      minAge,
      maxAge,
      gender,
      createdAt,
      participations,
    } = meet;
    return {
      ...super.of(meet),
      body,
      maxParticipants,
      isOnline,
      location,
      minAge,
      maxAge,
      gender,
      createdAt,
      participants: participations
        .map((participation) => participation.user)
        .map(UserResponseDto.of),
    };
  }
}

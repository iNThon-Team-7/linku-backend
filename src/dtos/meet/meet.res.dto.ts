import { Meet } from 'src/entities';
import { Gender } from 'src/lib/enums';

export class MeetResponseDto {
  id: number;
  hostId: number;
  title: string;
  body: string;
  maxParticipants: number;
  meetTime: Date;
  isOnline: boolean;
  location: string;
  minAge: number;
  maxAge: number;
  gender: Gender;
  createdAt: Date;
  tagId: number;

  static of(meet: Meet): MeetResponseDto {
    const {
      id,
      hostId,
      title,
      body,
      maxParticipants,
      meetTime,
      isOnline,
      location,
      minAge,
      maxAge,
      gender,
      createdAt,
      tagId,
    } = meet;

    return {
      id,
      hostId,
      title,
      body,
      maxParticipants,
      meetTime,
      isOnline,
      location,
      minAge,
      maxAge,
      gender,
      createdAt,
      tagId,
    };
  }
}

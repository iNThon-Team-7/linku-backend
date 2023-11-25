import { IsString } from 'class-validator';

export class AuthFcmRequestDto {
  @IsString()
  fcmToken: string;
}

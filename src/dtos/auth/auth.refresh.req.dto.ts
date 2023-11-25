import { IsString } from 'class-validator';

export class AuthRefreshRequestDto {
  @IsString()
  refreshToken: string;
}

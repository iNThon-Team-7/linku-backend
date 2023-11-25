import { IsString } from 'class-validator';

export class AuthLoginRequestDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

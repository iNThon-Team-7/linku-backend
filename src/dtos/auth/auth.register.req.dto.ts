import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthRegisterRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

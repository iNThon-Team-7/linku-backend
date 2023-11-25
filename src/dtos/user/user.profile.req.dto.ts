import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Gender } from 'src/lib/enums';

class UserProfileRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  intro?: string;

  @IsOptional()
  @IsNumber()
  @Min(19)
  @Max(99)
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}

export { UserProfileRequestDto };

import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Gender } from 'src/lib/enums';

export class MeetOpenRequestDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsNumber()
  tagId: number;

  @IsNumber()
  @Min(2)
  maxParticipants: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  meetTime: Date;

  @IsBoolean()
  isOnline: boolean;

  @IsString()
  location: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsNumber()
  @IsOptional()
  @Min(19)
  minAge?: number;

  @IsNumber()
  @IsOptional()
  @Max(99)
  maxAge?: number;
}

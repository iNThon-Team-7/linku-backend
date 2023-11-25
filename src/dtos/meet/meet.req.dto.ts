import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from '../common';

export class MeetRequestDto extends PaginationDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  subscribed?: boolean = false;
}

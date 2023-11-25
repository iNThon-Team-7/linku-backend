import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

class TagSubscriptionRequestDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id: number;
}

export { TagSubscriptionRequestDto };

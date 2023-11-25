import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

class UserRequestDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id: number;
}

export { UserRequestDto };

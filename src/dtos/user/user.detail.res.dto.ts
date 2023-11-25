import { User } from 'src/entities';
import { Gender, Role } from 'src/lib/enums';
import { TagResponseDto } from '../tag';
import { UserResponseDto } from './user.res.dto';

export class UserDetailResponseDto extends UserResponseDto {
  email: string;
  role: Role;
  age: number;
  gender: Gender;
  tags: TagResponseDto[];

  static of(user: User): UserDetailResponseDto {
    const { email, role, age, gender, subscriptions } = user;
    const tags = subscriptions.map((subscription) =>
      TagResponseDto.of(subscription.tag),
    );

    return { ...super.of(user), email, role, age, gender, tags };
  }
}

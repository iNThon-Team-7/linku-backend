import { User } from 'src/entities';

export class UserResponseDto {
  id: number;
  email: string;

  static of(user: User): UserResponseDto {
    const { id, email } = user;
    return { id, email };
  }
}

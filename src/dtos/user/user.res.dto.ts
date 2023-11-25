import { User } from 'src/entities';

export class UserResponseDto {
  id: number;
  name: string;
  intro: string;

  static of(user: User): UserResponseDto {
    const { id, name, intro } = user;
    return { id, name, intro };
  }
}

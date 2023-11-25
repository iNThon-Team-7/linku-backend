import { User } from 'src/entities';
import { Role } from 'src/lib/enums';

export class UserResponseDto {
  id: number;
  email: string;
  role: Role;

  static of(user: User): UserResponseDto {
    const { id, email, role } = user;
    return { id, email, role };
  }
}

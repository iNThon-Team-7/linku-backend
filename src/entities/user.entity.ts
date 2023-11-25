import { Role } from 'src/lib/enums';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique('user_email_uk', ['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'user_pk' })
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'enum', enum: Role, default: 'PENDING' })
  role: Role;
}

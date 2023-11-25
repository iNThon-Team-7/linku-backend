import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meet, User } from '.';

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'comment_pk' })
  id: number;

  @Column()
  userId: number;

  @Column()
  meetId: number;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({
    foreignKeyConstraintName: 'comment_user_id_fk',
  })
  user: User;

  @ManyToOne(() => Meet, (meet) => meet.comments)
  @JoinColumn({
    foreignKeyConstraintName: 'comment_meet_id_fk',
  })
  meet: Meet;
}

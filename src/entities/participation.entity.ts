import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Meet } from './meet.entity';

@Entity({ name: 'participation' })
export class Participation extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'participation_pk' })
  id: number;

  @Column()
  userId: number;

  @Column()
  meetId: number;

  @ManyToOne(() => User, (user) => user.participations)
  @JoinColumn({
    foreignKeyConstraintName: 'participation_user_id_fk',
  })
  user: User;

  @ManyToOne(() => Meet, (meet) => meet.participations)
  @JoinColumn({
    foreignKeyConstraintName: 'participation_meet_id_fk',
  })
  meet: Meet;
}

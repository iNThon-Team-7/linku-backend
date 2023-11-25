import { Gender, Role } from 'src/lib/enums';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Participation } from './participation.entity';
import { Meet } from './meet.entity';
import { Comment } from './comment.entity';

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

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  intro: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  age: number;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Meet, (meet) => meet.host)
  hosts: Meet[];

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

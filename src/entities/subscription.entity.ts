import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'subscription' })
export class Subscription extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'subscription_pk' })
  id: number;

  @Column()
  userId: number;

  @Column()
  tagId: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({
    foreignKeyConstraintName: 'subscription_user_id_fk',
  })
  user: User;

  @ManyToOne(() => Tag, (tag) => tag.subscriptions)
  @JoinColumn({
    foreignKeyConstraintName: 'subscription_tag_id_fk',
  })
  tag: Tag;
}

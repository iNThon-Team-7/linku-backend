import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Meet } from './meet.entity';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'tag_pk' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Subscription, (subscription) => subscription.tag)
  subscriptions: Subscription[];

  @OneToMany(() => Meet, (meet) => meet.tag)
  meets: Meet[];
}

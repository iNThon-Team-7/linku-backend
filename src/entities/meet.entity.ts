import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Gender } from 'src/lib/enums';
import { Participation } from './participation.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'meet' })
export class Meet extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'meet_pk' })
  id: number;

  @Column()
  hostId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column()
  maxParticipants: number;

  @Column({ type: 'timestamptz' })
  meetTime: Date;

  @Column({ type: 'boolean' })
  isOnline: boolean;

  @Column()
  location: string;

  @Column({ nullable: true })
  minAge: number;

  @Column({ nullable: true })
  maxAge: number;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column()
  tagId: number;

  @OneToMany(() => Comment, (comment) => comment.meet)
  comments: Comment[];

  @ManyToOne(() => Tag, (tag) => tag.meets)
  @JoinColumn({
    foreignKeyConstraintName: 'meet_tag_id_fk',
  })
  tag: Tag;

  @ManyToOne(() => User, (user) => user.hosts)
  @JoinColumn({
    foreignKeyConstraintName: 'meet_user_id_fk',
    name: 'host_id',
  })
  host: User;

  @ManyToOne(() => Participation, (participation) => participation.meet)
  participations: Participation[];
}

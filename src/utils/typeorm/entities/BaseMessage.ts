import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

export abstract class BaseMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: number;

  @ManyToOne(() => User, (user) => user.messages)
  author: User;
}

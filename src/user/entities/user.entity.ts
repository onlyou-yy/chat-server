import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: '' })
  avatar: string;

  @CreateDateColumn()
  creationTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ default: true })
  isActive: boolean;
}

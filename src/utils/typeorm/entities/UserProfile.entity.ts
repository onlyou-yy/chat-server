import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  about?: string;

  @Column({ nullable: true })
  banner?: string;

  @OneToOne(() => User)
  user: User;
}

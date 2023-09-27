import { Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Peer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.peer)
  user: User;
}

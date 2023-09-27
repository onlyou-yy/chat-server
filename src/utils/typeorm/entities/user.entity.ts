import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './Message.entity';
import { Group } from './Group.entity';
import { UserPresence } from './UserPresence.entity';
import { UserProfile } from './UserProfile.entity';
import { Peer } from './Peer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  account: string;

  @CreateDateColumn()
  creationTime: number;

  @UpdateDateColumn()
  updateTime: number;

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

  @OneToOne(() => UserProfile, { cascade: ['insert', 'update'] })
  @JoinColumn()
  profile: UserProfile;

  @OneToOne(() => UserPresence, { cascade: ['insert', 'update'] })
  @JoinColumn()
  presence: UserPresence;

  @OneToOne(() => Peer, (peer) => peer.user, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  peer: Peer;
}

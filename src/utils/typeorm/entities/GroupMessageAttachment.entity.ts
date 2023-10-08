import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './Message.entity';

@Entity()
export class GroupMessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  src: string;

  @ManyToOne(() => Message, (messgae) => messgae.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;
}

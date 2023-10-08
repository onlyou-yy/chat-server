import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './Message.entity';

@Entity()
export class MessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  src: string;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;
}

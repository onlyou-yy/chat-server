import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Group } from './Group.entity';
import { BaseMessage } from './baseMessage';
import { GroupMessageAttachment } from './GroupMessageAttachment.entity';

@Entity()
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message)
  @JoinColumn()
  attachments: GroupMessageAttachment[];
}

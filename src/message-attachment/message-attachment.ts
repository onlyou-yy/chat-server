import { Attachment } from 'src/utils/interfaces';
import { GroupMessageAttachment, MessageAttachment } from '../utils/typeorm';

export interface IMessageAttachmentsService {
  create(attachments: Attachment[]): Promise<MessageAttachment[]>;
  createGroupAttachments(
    attachments: Attachment[],
  ): Promise<GroupMessageAttachment[]>;
  deleteAllAttachments(attachments: MessageAttachment[]);
}

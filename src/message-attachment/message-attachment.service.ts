import { MessageAttachment, GroupMessageAttachment } from 'src/utils/typeorm';
import { IMessageAttachmentsService } from './message-attachment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { Attachment } from 'src/utils/interfaces';

export class MessageAttachmentService implements IMessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepo: Repository<MessageAttachment>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupAttachmentRepo: Repository<GroupMessageAttachment>,
    private readonly fileStorage: FileStorageService,
  ) {}
  create(attachments: Attachment[]): Promise<MessageAttachment[]> {
    const promises = attachments.map((file) => {
      const newAttachment = this.attachmentRepo.create();
      return this.attachmentRepo
        .save(newAttachment)
        .then((messageAttachment) => {
          return this.fileStorage.uploadMessageAttachment({
            file,
            messageAttachment,
          });
        });
    });
    return Promise.all(promises);
  }
  createGroupAttachments(
    attachments: Attachment[],
  ): Promise<GroupMessageAttachment[]> {
    const promises = attachments.map((attachment) => {
      const newAttachment = this.groupAttachmentRepo.create();
      return this.groupAttachmentRepo
        .save(newAttachment)
        .then((messageAttachment) => {
          return this.fileStorage.uploadGroupMessageAttachment({
            file: attachment,
            messageAttachment,
          });
        });
    });
    return Promise.all(promises);
  }
  deleteAllAttachments(attachments: MessageAttachment[]) {
    const promises = attachments.map((attachment) => {
      return this.attachmentRepo.delete(attachment.id);
    });
    return Promise.all(promises);
  }
}

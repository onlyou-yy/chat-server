import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageModule } from 'src/file-storage/file-storage.module';
import { GroupMessageAttachment, MessageAttachment } from 'src/utils/typeorm';
import { MessageAttachmentService } from './message-attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageAttachment, GroupMessageAttachment]),
    FileStorageModule,
  ],
  providers: [MessageAttachmentService],
  exports: [MessageAttachmentService],
})
export class MessageAttachmentModule {}

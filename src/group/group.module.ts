import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isAuthorized } from '../utils/helpers';
import { Group, GroupMessage } from '../utils/typeorm';
import { GroupMessageController } from './controllers/group-messages.controller';
import { GroupRecipientsController } from './controllers/group-recipients.controller';
import { GroupController } from './controllers/group.controller';
import { GroupRecipientService } from './services/group-recipient.service';
import { GroupService } from './services/group.service';
import { UserModule } from 'src/user/user.module';
import { MessageAttachmentModule } from 'src/message-attachment/message-attachment.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';
import { GroupMessageService } from './services/group-message.service';

@Module({
  imports: [
    UserModule,
    MessageAttachmentModule,
    FileStorageModule,
    TypeOrmModule.forFeature([Group, GroupMessage]),
  ],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupRecipientsController,
  ],
  providers: [GroupService, GroupMessageService, GroupRecipientService],
  exports: [GroupService],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAuthorized).forRoutes('groups/:id');
  }
}

import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ExistsController } from './exists.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConversationsModule, UserModule],
  controllers: [ExistsController],
  providers: [],
})
export class ExistsModule {}

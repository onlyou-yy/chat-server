import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as moment from 'moment';
import { GroupMessageAttachment, MessageAttachment } from 'src/utils/typeorm';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageAttachment, GroupMessageAttachment]),
  ],
  exports: [FileStorageService],
  providers: [
    FileStorageService,
    {
      provide: 'MomentWrapper',
      useFactory: async () => moment(),
    },
  ],
})
export class FileStorageModule {}

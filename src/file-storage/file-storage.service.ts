import { Inject, Injectable } from '@nestjs/common';
import { IFileStorageService } from './file-storage';
import { MessageAttachment, GroupMessageAttachment } from 'src/utils/typeorm';
import {
  UploadImageParams,
  UploadMessageAttachmentParams,
  UploadGroupMessageAttachmentParams,
} from 'src/utils/types';
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from 'src/utils/interfaces';

const assetsDir = 'assets/uploads';
const assetsPath = path.resolve(__dirname, `../../${assetsDir}`);
const baseURL = `http://localhost:3000/${assetsDir}`;

@Injectable()
export class FileStorageService implements IFileStorageService {
  constructor(
    @Inject('MomentWrapper') private readonly momentWrapper: moment.Moment,
    @InjectRepository(MessageAttachment)
    private readonly messageAttachment: Repository<MessageAttachment>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupMessageAttachment: Repository<GroupMessageAttachment>,
  ) {}

  upload(params: UploadImageParams) {
    return this.saveFile(params.file, params.key);
  }

  uploadMessageAttachment(
    params: UploadMessageAttachmentParams,
  ): Promise<MessageAttachment> {
    const fileData = this.saveFile(params.file);
    params.messageAttachment.src = fileData.src;
    return this.messageAttachment.save(params.messageAttachment);
  }

  uploadGroupMessageAttachment(
    params: UploadGroupMessageAttachmentParams,
  ): Promise<GroupMessageAttachment> {
    const fileData = this.saveFile(params.file);
    params.messageAttachment.src = fileData.src;
    return this.groupMessageAttachment.save(params.messageAttachment);
  }

  saveFile(file: Attachment, filename?: string) {
    if (!existsSync(assetsPath)) {
      mkdirSync(assetsPath, { recursive: true });
    }
    const now = this.momentWrapper.format('YYYYMMDD');
    const name = filename ? filename : file.originalname;
    const fileDir = `${assetsPath}/${now}`;
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir);
    }
    const filepath = `${fileDir}/${name}`;
    writeFileSync(filepath, file.buffer);

    const src = `${baseURL}/${now}/${name}`;

    return {
      filepath,
      src,
    };
  }
}

import { GroupMessageAttachment, MessageAttachment } from 'src/utils/typeorm';
import {
  UploadGroupMessageAttachmentParams,
  UploadImageParams,
  UploadMessageAttachmentParams,
} from 'src/utils/types';

export interface IFileStorageService {
  upload(params: UploadImageParams);
  uploadMessageAttachment(
    params: UploadMessageAttachmentParams,
  ): Promise<MessageAttachment>;
  uploadGroupMessageAttachment(
    params: UploadGroupMessageAttachmentParams,
  ): Promise<GroupMessageAttachment>;
}

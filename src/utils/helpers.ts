import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
  return bcrypt.compare(rawPassword, hashedPassword);
}

export const generateUUIDV4 = () => uuidv4();

export const compressImage = (attachment: Express.Multer.File) =>
  sharp(attachment.buffer).resize(300).jpeg().toBuffer();

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsBoolean, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID()
  id: string;
  @IsString()
  avatar?: string;
  @IsBoolean()
  isActive?: boolean;
}

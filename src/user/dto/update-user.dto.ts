import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  id: number;
  @IsString()
  avatar?: string;
  @IsBoolean()
  isActive?: boolean;
}
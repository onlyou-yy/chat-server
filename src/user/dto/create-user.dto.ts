import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(18)
  @IsString()
  password: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePresenceStatusDto {
  @IsString()
  @IsNotEmpty()
  statusMessage: string;
}

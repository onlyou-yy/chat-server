import { IsNotEmpty } from 'class-validator';

export class AddGroupRecipientDto {
  @IsNotEmpty()
  account: string;
}

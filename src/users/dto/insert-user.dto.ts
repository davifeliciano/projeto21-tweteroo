import { IsNotEmpty, IsUrl } from 'class-validator';

export class InsertUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;
}

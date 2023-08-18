import { IsNotEmpty } from 'class-validator';

export class InsertTweetDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  tweet: string;
}

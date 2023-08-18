import { IsNotEmpty, IsUrl } from 'class-validator';

export class InsertUserDto {
  @IsNotEmpty({ message: 'All fields are required!' })
  username: string;

  @IsNotEmpty({ message: 'All fields are required!' })
  @IsUrl()
  avatar: string;
}

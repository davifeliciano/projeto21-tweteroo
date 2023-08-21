import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { InsertTweetDto } from './dto/insert-tweet.dto';
import { UsersService } from '../users/users.service';
import { PageDto } from './dto/page.dto';

@Controller('tweets')
export class TweetsController {
  constructor(
    private readonly tweetService: TweetsService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  insert(@Body() insertTweetDto: InsertTweetDto) {
    const { username, tweet } = insertTweetDto;
    const user = this.userService.find(username);

    if (!user) {
      throw new HttpException(
        'No user found with this username',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.tweetService.insert({ user, tweet });
  }

  @Get()
  getPage(@Query() pageDto: PageDto) {
    return this.tweetService.getPage(pageDto.page);
  }

  @Get(':username')
  getAllFromUser(@Param('username') username: string) {
    return this.tweetService.getAllFromUser(username);
  }
}

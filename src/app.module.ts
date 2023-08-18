import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { TweetsService } from './tweets/tweets.service';
import { UsersController } from './users/users.controller';
import { TweetsController } from './tweets/tweets.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, TweetsController],
  providers: [AppService, UsersService, TweetsService],
})
export class AppModule {}

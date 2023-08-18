import { Injectable } from '@nestjs/common';
import { Tweet } from './interfaces/tweet.interface';

function tweetMapper(tweet: Tweet) {
  return {
    username: tweet.user.username,
    avatar: tweet.user.avatar,
    tweet: tweet.tweet,
  };
}

@Injectable()
export class TweetsService {
  private readonly tweets: Tweet[] = [];
  private readonly TWEETS_PER_PAGE: number = 10;
  private readonly TWEETS_IF_NO_PAGE: number = 15;

  insert(tweet: Tweet) {
    this.tweets.push(tweet);
  }

  getPage(page?: number) {
    if (!page) {
      return this.tweets
        .slice(-this.TWEETS_IF_NO_PAGE)
        .map(tweetMapper)
        .reverse();
    }

    const start = -page * this.TWEETS_PER_PAGE;
    let end = start + this.TWEETS_PER_PAGE;
    if (end >= 0) end = this.tweets.length;

    return this.tweets.slice(start, end).map(tweetMapper).reverse();
  }

  getAllFromUser(username: string) {
    return this.tweets
      .filter((tweet) => tweet.user.username === username)
      .map(tweetMapper)
      .reverse();
  }
}

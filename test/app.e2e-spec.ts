import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { signUpUser } from './factories/signup-user';
import { tweetFromUser } from './factories/tweet-from-user';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/health => should get an alive message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect("I'm okay!");
  });

  it('/signup => should sign-up successfully', () => {
    return request(app.getHttpServer())
      .post('/sign-up')
      .send({
        username: 'test',
        avatar: 'http://test.com.br/image.png',
      })
      .expect(HttpStatus.OK);
  });

  it('/signup => should deny a sign-up when data is wrong', async () => {
    return request(app.getHttpServer())
      .post('/sign-up')
      .send({
        username: 'test',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/signup => should accept a sign-up', () => {
    return request(app.getHttpServer())
      .post('/sign-up')
      .send({
        username: 'test',
        avatar: 'http://test.com.br/image.png',
      })
      .expect(HttpStatus.OK);
  });

  it('POST /tweets should create a tweet', async () => {
    const username = 'test';
    await signUpUser(app, { username, avatar: 'http://test.com.br/image.png' });

    return request(app.getHttpServer())
      .post('/tweets')
      .send({
        username,
        tweet: 'tweet',
      })
      .expect(HttpStatus.CREATED);
  });

  it('POST /tweets should fail when user did not signup before', () => {
    return request(app.getHttpServer())
      .post('/tweets')
      .send({
        username: 'test',
        tweet: 'tweet',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('GET /tweets should get only the latest 15 tweets', async () => {
    const tweetsQuantity = 15;
    const username = 'test';

    await signUpUser(app, { username, avatar: 'http://test.com.br?image.png' });

    for (let i = 0; i < tweetsQuantity; i++) {
      await tweetFromUser(app, {
        username,
        tweet: 'test tweet',
      });
    }

    const response = await request(app.getHttpServer()).get('/tweets');

    expect(response.body).toHaveLength(15);
    expect(response.body[0]).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    });
  });

  it('GET /tweets?page=<page> should get the page of tweets correctly', async () => {
    const tweetsQuantity = 15;
    const username = 'test';
    await signUpUser(app, { username, avatar: 'http://test.com.br?image.png' });

    for (let i = tweetsQuantity; i > 0; i--) {
      await tweetFromUser(app, {
        username,
        tweet: `tweet ${i}`,
      });
    }

    const firstPageResponse = await request(app.getHttpServer()).get(
      '/tweets?page=1',
    );

    const secondPageResponse = await request(app.getHttpServer()).get(
      '/tweets?page=2',
    );

    expect(firstPageResponse.body).toHaveLength(10);
    expect(firstPageResponse.body.at(0)).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: 'tweet 1',
    });

    expect(firstPageResponse.body.at(-1)).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: 'tweet 10',
    });

    expect(secondPageResponse.body).toHaveLength(5);
    expect(secondPageResponse.body.at(0)).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: 'tweet 11',
    });
  });

  it('GET /tweets should get error when page param is wrong', async () => {
    return request(app.getHttpServer())
      .get('/tweets?page=0')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('GET /tweets/:username should get the tweets of a specific user', async () => {
    const tweetsQuantity = 10;

    for (let i = 0; i < tweetsQuantity; i++) {
      const username = `test${i}`;
      await signUpUser(app, {
        username,
        avatar: 'http://test.com.br?image.png',
      });
      await tweetFromUser(app, { username, tweet: 'test tweet' });
    }

    const response = await request(app.getHttpServer()).get('/tweets/test1');
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    });
  });

  it('GET /tweets/:username should return an empty array is user does not exist', async () => {
    const response = await request(app.getHttpServer()).get('/tweets/user');
    expect(response.body).toHaveLength(0);
  });

  afterAll(async () => {
    await app.close();
  });
});

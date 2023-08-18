import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  insert(user: User) {
    this.users.push(user);
  }

  find(username: string) {
    return this.users.find((user) => user.username === username);
  }
}

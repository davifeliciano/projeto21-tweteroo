import { User } from '../../users/interfaces/user.interface';

export interface Tweet {
  user: User;
  tweet: string;
}

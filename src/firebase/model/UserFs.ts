import { Roles, User } from 'src/users/model/User';
import { Collection } from 'fireorm';

@Collection('users')
export class UserFS implements User {
  id: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  resetCode?: string;
  email: string;
  roles?: Roles;
  password: string;
  enable?: boolean;
}

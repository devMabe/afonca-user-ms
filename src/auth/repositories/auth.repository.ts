import { AuthResponse, User } from 'src/users/model/User';

export abstract class AuthRepository {
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (userParams: User) => Promise<AuthResponse>;
}

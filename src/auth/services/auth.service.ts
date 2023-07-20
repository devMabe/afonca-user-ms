import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from 'src/users/model/User';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(username: string, password: string) {
    return await this.authRepository.login(username, password);
  }

  async register(params: User) {
    return await this.authRepository.register(params);
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { Roles, User, UserReponse } from '../model/User';
import { generateToken } from 'src/utils/security';
import { encrypt } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: User): Promise<UserReponse> {
    const hashPassword = await encrypt(user.password);
    user.password = hashPassword;

    const response = await this.userRepository.create(user);

    const token = await generateToken({ user: response });
    return this.mapToUserResponse(response, token.fbToken);
  }

  async setStatus(id: string, enable: boolean) {
    return await this.userRepository.setStatus(id, enable);
  }

  async setRole(id: string, role: Roles) {
    return await this.userRepository.setRole(id, role);
  }

  async findUser(userId: string): Promise<UserReponse> {
    const response = await this.userRepository.getById(userId);
    return this.mapToUserResponse(response);
  }

  async updateUser(
    id: string,
    body: Pick<User, 'firstName' | 'lastName'>,
  ): Promise<UserReponse> {
    const user = await this.findUser(id);
    Object.assign(user, body);
    const response = await this.userRepository.update(user);
    return this.mapToUserResponse(response);
  }

  async findUsers() {
    const responses = await this.userRepository.getAll();
    return responses.map((response) => this.mapToUserResponse(response));
  }

  async resetPassword(email: string) {
    return await this.userRepository.resetPassword(email);
  }

  async confirmPassword(resetCode: string, newPassword: string) {
    return await this.userRepository.confirmPassword(newPassword, resetCode);
  }

  private mapToUserResponse(user: User, token?: string): UserReponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      enable: user.enable,
      token,
      roles: user.roles,
    };
  }
}

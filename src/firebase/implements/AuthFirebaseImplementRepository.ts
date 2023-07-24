import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { verified } from 'src/utils/bcrypt';
import { generateToken, verifyToken } from 'src/utils/security';
import { AuthResponse, User } from 'src/users/model/User';

@Injectable()
export class AuthFirebaseImplementRepository implements AuthRepository {
  constructor(private userRepo: UserRepository) {}

  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepo.getByEmail(username);
    if (user) {
      if (await verified(password, user.password)) {
        delete user.password;
        const token = await generateToken({ user });
        const validSession = verifyToken(token.fbToken);
        if (validSession) {
          return {
            accessToken: token.fbToken,
          };
        } else {
          throw new BadRequestException('Token invalido');
        }
      } else {
        throw new BadRequestException('Usuario o contraseña incorrectas');
      }
    } else {
      throw new BadRequestException('El correo no fue encontrado');
    }
  }

  async register(userParams: User): Promise<AuthResponse> {
    const response = await this.userRepo.create(userParams);
    if (response) {
      delete response.password;
      const token = await generateToken({ user: response });
      const validSession = verifyToken(token.fbToken);

      if (validSession) {
        return {
          accessToken: token.fbToken,
        };
      } else {
        throw new BadRequestException('Oucurrio un error en la creación');
      }
    }
  }
}

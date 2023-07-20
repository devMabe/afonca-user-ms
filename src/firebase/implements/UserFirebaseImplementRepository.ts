import { Roles, User } from 'src/users/model/User';
import { UserRepository } from 'src/users/repositories/users.repository';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { UserFS } from '../model/UserFs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseRepoProvider } from '../provider/firebase.provider';
import { encrypt } from 'src/utils/bcrypt';

@Injectable()
export class UserFirebaseImplementRepository implements UserRepository {
  constructor(private repos: FirebaseRepoProvider) {}

  async confirmPassword(newPassword: string, resetCode: string): Promise<void> {
    const user = await this.getByResetCode(resetCode);

    if (user) {
      user.password = await encrypt(newPassword);
      await this.update(user);
      console.log('Contraseña cambiada exitosamente.');
    } else {
      throw new BadRequestException('El codigo ingresado es incorrecto');
    }
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetCode = this.generateResetCode();

    user.resetCode = resetCode;
    await this.update(user);

    this.sendResetCodeByEmail(email, resetCode);
  }

  async setRole(id: string, role: Roles): Promise<void> {
    const user = await this.repos.usersRepo.findById(id);
    if (user) {
      user.roles = role;
      await this.repos.usersRepo.update(user);
    }
  }

  async setStatus(id: string, status: boolean): Promise<void> {
    const user = await this.repos.usersRepo.findById(id);
    if (user) {
      user.enable = status;
      await this.repos.usersRepo.update(user);
    }
  }

  async create(user: User): Promise<User> {
    const u = new UserFS();

    if (user.email) {
      const userWithSameEmail = await this.getByEmail(user.email);
      if (userWithSameEmail)
        throw new BadRequestException('Email already in use');
    }

    const displayName = `${user.firstName} ${user.lastName}`;
    const newUserID = await this.createFirebaseUser(
      user.password,
      user.email,
      displayName,
    );

    Object.assign(u, user);
    u.id = newUserID;
    u.enable = false;
    u.roles = Roles.USER;
    const newUser = await this.repos.usersRepo.create(u);

    const res: any = {};
    Object.assign(res, newUser);
    return res;
  }

  async update(user: User): Promise<User> {
    const oldUser = await this.repos.usersRepo.findById(user.id);
    if (oldUser) {
      Object.assign(oldUser, user);
      return await this.repos.usersRepo.update(oldUser);
    }
  }

  async getById(userId: string): Promise<User | undefined> {
    return this.repos.usersRepo.findById(userId);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.repos.usersRepo
      .whereEqualTo('email', email)
      .find();
    if (users && users.length > 0) return users[0];
    return undefined;
  }

  async getByResetCode(resetCode: string): Promise<User | undefined> {
    const users = await this.repos.usersRepo
      .whereEqualTo('resetCode', resetCode)
      .find();
    if (users && users.length > 0) return users[0];
    return undefined;
  }

  async getAll(): Promise<User[]> {
    return this.repos.usersRepo.find();
  }

  private async createFirebaseUser(
    password?: string,
    email?: string,
    displayName?: string,
  ): Promise<string> {
    console.log('Creating FirebaseAuth User with email:' + email);
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    console.log('New user uid:' + userRecord.uid);
    return userRecord.uid;
  }

  private generateResetCode(): string {
    const codeLength = 6;
    return crypto.randomBytes(codeLength).toString('hex');
  }

  private sendResetCodeByEmail(email: string, resetCode: string): void {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Código de reseteo de contraseña',
      text: `Tu código de reseteo de contraseña es: ${resetCode} `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error enviando el correo', error);
      } else {
        console.log('Correo enviado: ', info.response);
      }
    });
  }
}

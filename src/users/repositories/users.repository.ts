import { Roles, User } from '../model/User';

export abstract class UserRepository {
  create: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
  getById: (userId: string) => Promise<User | undefined>;
  getAll: () => Promise<User[]>;
  getByEmail: (email: string) => Promise<User | undefined>;
  setStatus: (id: string, status: boolean) => Promise<void>;
  setRole: (id: string, role: Roles) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getByResetCode: (resetCode: string) => Promise<User | undefined>;
  confirmPassword: (newPassword: string, resetCode: string) => Promise<void>;
}

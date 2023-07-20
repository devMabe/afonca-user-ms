export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  roles?: Roles;
  email?: string;
  resetCode?: string;
  password?: string;
  enable?: boolean;
}

export enum Roles {
  'ADMIN' = 'ADMIN',
  'USER' = 'USER',
}

export type UserReponse = Omit<User, 'password'> & {
  token?: string;
};

export interface TokenData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enable?: boolean;
}

export interface Auth {
  token?: string;
  fbToken?: string;
}

export interface AuthResponse {
  accessToken?: string;
}

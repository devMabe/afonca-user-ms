import * as jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';

import { User, TokenData } from 'src/users/model/User';
import { Auth } from 'src/users/model/User';
import {
  FIREBASE_PRIVATE_KEY,
  TOKEN_EXPIRE_IN,
  TOKEN_SECRET_KEY,
} from 'src/firebase/config';

export function buildTokenFromUser(user: TokenData) {
  const data: User = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    enable: user.enable,
  };
  return createJWT(data);
}

export function createJWT(data: TokenData): string {
  const token = jwt.sign({ data }, TOKEN_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRE_IN,
  });
  return token;
}

export function _createJWT(data: any): string {
  const token = jwt.sign({ data }, TOKEN_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRE_IN,
  });
  return token;
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, FIREBASE_PRIVATE_KEY);
    console.log('Token decoded: ', decoded);
    return true;
  } catch (ex) {
    console.log('Invalid token');
    return false;
  }
}

export function decodeJwt<T>(token: string): T {
  const decoded: any = jwt.verify(token, FIREBASE_PRIVATE_KEY);
  return decoded;
}

export function decodeToken(token: string): TokenData {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as any;
    console.log('Token decoded', decoded);
    return decoded.data;
  } catch (ex) {
    console.log('Invalid token');
    throw new Error('INVALID_TOKEN');
  }
}

export async function generateToken({
  user,
}: {
  user: TokenData;
}): Promise<Auth> {
  const token = buildTokenFromUser(user);
  const fbtoken = await admin.auth().createCustomToken(user.id, user);
  return { token, fbToken: fbtoken };
}

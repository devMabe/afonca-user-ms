import * as serviceAccount from 'firebaseAccountKey.json';

export const FIREBASE_PROJECT_ID = serviceAccount.project_id;
export const FIREBASE_CLIENT_EMAIL = serviceAccount.client_email;
export const FIREBASE_PRIVATE_KEY = serviceAccount.private_key;
export const FIREBASE_BUCKET_URL = process.env.STORAGE_BUCKET_URL;

const secondDay = 60 * 60 * 24; // un día
export const TOKEN_EXPIRE_IN = secondDay;

export const TOKEN_SECRET_KEY = serviceAccount.private_key_id;

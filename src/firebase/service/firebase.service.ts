import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  FIREBASE_BUCKET_URL,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from '../config';

@Injectable()
export class FirebaseService {
  private _serviceAccount: admin.ServiceAccount;
  private _app: admin.app.App;
  private _db: FirebaseFirestore.Firestore;
  private _storage: admin.storage.Storage;
  private _auth: admin.auth.Auth;

  constructor() {
    this.initialize();
  }

  public initialize() {
    this._serviceAccount = {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    };

    this._app = admin.initializeApp({
      credential: admin.credential.cert(this._serviceAccount),
      storageBucket: FIREBASE_BUCKET_URL,
    });

    this._db = admin.firestore(this._app);
    this._db.settings({
      ignoreUndefinedProperties: true,
    });
    this._storage = admin.storage(this._app);
    this._auth = admin.auth(this._app);
  }

  get app(): admin.app.App {
    return this._app;
  }

  get auth(): admin.auth.Auth {
    return this._auth;
  }

  get database(): FirebaseFirestore.Firestore {
    return this._db;
  }

  get storage(): admin.storage.Storage {
    return this._storage;
  }

  public serviceAccount() {
    return this._serviceAccount;
  }
  public getBucket() {
    return this._storage.bucket(this.getBucketName());
  }

  public getBucketName() {
    return FIREBASE_BUCKET_URL;
  }
}

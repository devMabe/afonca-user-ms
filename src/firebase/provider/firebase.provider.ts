import { Injectable } from '@nestjs/common';
import * as fireorm from 'fireorm';
import { UserFS } from '../model/UserFs';
import { FirebaseService } from '../service/firebase.service';

@Injectable()
export class FirebaseRepoProvider {
  constructor(private services: FirebaseService) {
    fireorm.initialize(services.database);
  }

  get usersRepo() {
    return fireorm.getRepository(UserFS);
  }
}

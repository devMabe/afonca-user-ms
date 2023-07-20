import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { UserRepository } from 'src/users/repositories/users.repository';
import { UserFirebaseImplementRepository } from './implements/UserFirebaseImplementRepository';
import { FirebaseRepoProvider } from './provider/firebase.provider';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { AuthFirebaseImplementRepository } from './implements/AuthFirebaseImplementRepository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: UserFirebaseImplementRepository,
    },
    {
      provide: AuthRepository,
      useClass: AuthFirebaseImplementRepository,
    },
    FirebaseService,
    FirebaseRepoProvider,
  ],
  exports: [
    {
      provide: UserRepository,
      useClass: UserFirebaseImplementRepository,
    },
    {
      provide: AuthRepository,
      useClass: AuthFirebaseImplementRepository,
    },
    FirebaseService,
  ],
})
export class FirebaseModule {}

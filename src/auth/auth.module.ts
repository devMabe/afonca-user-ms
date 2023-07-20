import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard.middleware';

@Module({
  imports: [FirebaseModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

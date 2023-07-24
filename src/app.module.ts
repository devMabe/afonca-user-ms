import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/services/users.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { CheckJwt } from './auth/middleware/session';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, FirebaseModule, AuthModule],
  controllers: [AppController],
  providers: [UsersService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckJwt)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/create', method: RequestMethod.POST },
        { path: 'users/enable/:id', method: RequestMethod.PUT },
        { path: 'users/set-role/:id', method: RequestMethod.PUT },
        { path: 'users/update-profile/:id', method: RequestMethod.PUT },
      );
  }
}

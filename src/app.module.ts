import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConcertsModule } from './concerts/concerts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ormConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConcertsModule,
    ReservationsModule,
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //   .apply(AuthMiddleware)
  //   .exclude({path: 'user/signup', method: RequestMethod.POST})
  //   .exclude({path: 'user'})
  // }
}

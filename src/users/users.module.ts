import { GetUserInfoQueryHandler } from './user.info.query.handler';
import { VerifyEmailHandler } from './command/verify.email.handler';
import { CreateUserHandler } from './command/create.user.handler';
import { UserEntity } from './user.entity';
import { EmailModule } from './../email/email.module';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginHandler } from './command/login.handler';
import { UserEventHandler } from './user.event.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
    EmailModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    UserEventHandler,
    GetUserInfoQueryHandler,
  ],
})
export class UsersModule {}

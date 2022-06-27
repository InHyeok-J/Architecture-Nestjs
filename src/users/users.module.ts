import { EamilService } from './infra/adapter/email.service';
import { VerifyEmailHandler } from './application/command/verify.email.handler';
import { CreateUserHandler } from './application/command/create.user.handler';
import { UsersController } from './interface/users.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginHandler } from './application/command/login.handler';
import { UserEventHandler } from './application/event/user.event.handler';
import { UserEntity } from './infra/db/user.entity';
import { GetUserInfoHandler } from './application/query/get.user.info.handler';
import { UserRepositoryImpl } from './infra/db/user.repository.impl';
import { UserEntityMapper } from './infra/db/user.entity.mapper';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    UserEventHandler,
    GetUserInfoHandler,
    EamilService,
    { provide: 'UserRepository', useClass: UserRepositoryImpl },
    UserEntityMapper,
  ],
})
export class UsersModule {}

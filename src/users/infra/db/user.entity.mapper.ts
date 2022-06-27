import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserEntity } from './user.entity';

@Injectable()
export class UserEntityMapper {
  constructor() {}

  toUser(userEntity: UserEntity): User {
    const { id, email, name, password, signupVerifyToken } = userEntity;
    return new User(id, name, email, password, signupVerifyToken);
  }
}

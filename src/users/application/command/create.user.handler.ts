import { UserCreateEvent } from '../../domain/user.create.event';
import { CreateUserCommand } from './create.user.command';
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import { IUserRepository } from 'src/users/domain/repository/user.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, name, password } = command;
    const userExist = await this.userRepository.findByEmail(email);

    if (userExist) {
      throw new HttpException('해당 email로 가입 불가능', 400);
    }

    const signUpToken = uuid.v1();
    const result = await this.userRepository.save(
      name,
      email,
      password,
      signUpToken,
    );
    if (result) {
      this.eventBus.publish(new UserCreateEvent(email, signUpToken));
    }
    return;
  }
}

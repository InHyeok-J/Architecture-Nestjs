import { TestEvent } from './../test.event';
import { UserCreateEvent } from './../user.create.event';
import { UserEntity } from './../user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserCommand } from './create.user.command';
import { Injectable, HttpException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, name, password } = command;
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new HttpException('해당 email로 가입 불가능', 400);
    }

    const signUpToken = uuid.v1();
    const result = await this.saveUser(name, email, password, signUpToken);
    if (result) {
      this.eventBus.publish(new UserCreateEvent(email, signUpToken));
      this.eventBus.publish(new TestEvent());
    }
    return;
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const existUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return existUser !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    singUpToken: string,
  ): Promise<boolean> {
    let isSuccess = true;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect(); //DB랑 커넥트

    console.log('start 트랜잭션');
    await queryRunner.startTransaction(); // 트랜잭션 시작.
    try {
      const user = new UserEntity();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = singUpToken;
      await queryRunner.manager.save(user);

      // throw new InternalServerErrorException('일부로 에러 발생');
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error('트랜잭션 롤백');
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      console.error('트랜잭션 릴리즈');
      await queryRunner.release();
      return isSuccess;
    }
  }
}

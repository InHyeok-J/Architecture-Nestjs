import { User } from './../../domain/user';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntityMapper } from './user.entity.mapper';
import { IUserRepository } from 'src/users/domain/repository/user.repository';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mapper: UserEntityMapper,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const findUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!findUser) {
      return null;
    }

    return this.mapper.toUser(findUser);
  }

  async findBySignupToken(token: string): Promise<User | null> {
    const findUser = await this.userRepository.findOne({
      where: {
        signupVerifyToken: token,
      },
    });

    if (!findUser) {
      return null;
    }

    return this.mapper.toUser(findUser);
  }

  async save(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
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
      user.signupVerifyToken = signupVerifyToken;
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

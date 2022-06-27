import { USER_REPOSITORY } from './../config/constant/database.constant';
import { EamilService } from './../email/email.service';
import { UserEntity } from './user.entity';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { UserInfo } from './UserInfo';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EamilService,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async creatUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new HttpException('해당 email로 가입 불가능', 400);
    }
    const signUpToken = uuid.v1();
    const result = await this.saveUser(name, email, password, signUpToken);
    if (result) {
      await this.sendMemberJoinEmail(email, signUpToken);
    }
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        signupVerifyToken,
      },
    });
    if (!user) {
      throw new HttpException('가입중인 유저가 존재하지 않습니다', 404);
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('유저가 존재하지 않습니다', 404);
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async getUserInfo(userId: number): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('유저가 존재하지 않습니다', 404);
    }
    return {
      email: user.email,
      name: user.name,
    };
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

  private async sendMemberJoinEmail(email: string, signUpToken: string) {
    await this.emailService.sendMemberJointVerfication(email, signUpToken);
    return;
  }
}

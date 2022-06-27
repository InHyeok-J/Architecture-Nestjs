import { UserEntity } from './../user.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify.email.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;
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
}

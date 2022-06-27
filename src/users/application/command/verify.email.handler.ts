import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify.email.command';
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IUserRepository } from 'src/users/domain/repository/user.repository';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;
    const user = await this.userRepository.findBySignupToken(signupVerifyToken);
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

import { LoginCommand } from './login.command';
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';
import { IUserRepository } from 'src/users/domain/repository/user.repository';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('유저가 존재하지 않습니다', 404);
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
}

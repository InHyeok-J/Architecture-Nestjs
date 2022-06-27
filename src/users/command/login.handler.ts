import { LoginCommand } from './login.command';
import { Injectable, HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command;

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
}

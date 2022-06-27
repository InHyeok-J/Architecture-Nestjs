import { RequestUserData } from './request.user.decorator';
import { AuthGuard } from './../auth/auth.guard';
import { UsersService } from './users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from './UserInfo';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
@Controller('users')
export class UsersController {
  constructor(
    private usersServie: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { email, name, password } = dto;
    this.printLoggerServiceLog(dto);
    await this.usersServie.creatUser(name, email, password);
    return;
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersServie.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    await this.usersServie.login(email, password);
    return;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Param('id') userId: number,
    @RequestUserData() user,
  ): Promise<UserInfo> {
    console.log(user);
    return await this.usersServie.getUserInfo(userId);
  }

  private printWinstonLog(dto) {
    console.log(this.logger.name);

    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    this.logger.info('info: ', dto);
    this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    this.logger.silly('silly: ', dto);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.info('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}

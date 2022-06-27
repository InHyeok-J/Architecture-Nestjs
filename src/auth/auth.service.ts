import { UserEntity } from './../users/user.entity';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, HttpException } from '@nestjs/common';
import authConfig from 'src/config/auth.config';
import * as jwt from 'jsonwebtoken';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (err) {
      throw new HttpException('인증 실패', 401);
    }
  }
}

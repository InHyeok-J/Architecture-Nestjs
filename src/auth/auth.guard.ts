import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = this.validateRequest(request);
    request.user = user;
    return true;
  }

  private validateRequest(request: Request) {
    if (
      request.headers.authorization &&
      request.headers.authorization.split('Bearer ')[1]
    ) {
      const jwtString = request.headers.authorization.split('Bearer ')[1];

      return this.authService.verify(jwtString);
    } else {
      throw new HttpException('올바른 JWT가 아닙니다', 401);
    }
  }
}

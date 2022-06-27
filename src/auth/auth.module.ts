import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}

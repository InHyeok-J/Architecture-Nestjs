import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}

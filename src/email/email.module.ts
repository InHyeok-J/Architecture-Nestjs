import { Module } from '@nestjs/common';
import { EamilService } from './email.service';

@Module({
  providers: [EamilService],
  exports: [EamilService],
})
export class EmailModule {}

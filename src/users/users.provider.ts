import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';
import {
  USER_REPOSITORY,
  DATABASE_PROVIDER,
} from './../config/constant/database.constant';

export const UserProvider = {
  provide: USER_REPOSITORY,
  useFactory: (dataSurce: DataSource) => dataSurce.getRepository(UserEntity),
  inject: [DATABASE_PROVIDER],
};

import { HttpException } from '@nestjs/common';
import { GetUserInfoQuery } from './get.user.info.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '../../interface/UserInfo';
import { UserEntity } from 'src/users/infra/db/user.entity';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User 가 없습니다.', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

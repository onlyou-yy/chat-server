import { hashPassword } from 'src/utils/helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Peer, User } from 'src/utils/typeorm';
import { IUserService } from '../interfaces/user';
import {
  CreateUserDetail,
  FindUserOptions,
  FindUserParams,
} from 'src/utils/types';
import { UserAccountAlreadyExists } from '../exceptions/UserAccountAlreadyExists';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Peer) private peerRepository: Repository<Peer>,
  ) {}

  async createUser(userDetail: CreateUserDetail): Promise<User> {
    const { account, password } = userDetail;
    const existingUser = await this.userRepository.findOneBy({ account });
    if (existingUser) {
      throw new UserAccountAlreadyExists();
    }
    const hashPas = await hashPassword(password);
    const peer = this.peerRepository.create();
    const params = { ...userDetail, password: hashPas, peer };
    return this.userRepository.save(params);
  }

  findUser(params: FindUserParams, options?: FindUserOptions): Promise<User> {
    const selections: (keyof User)[] = ['account', 'username', 'id'];
    const selectWithPassword: (keyof User)[] = options?.selectAllField
      ? [...selections, 'password']
      : selections;
    return this.userRepository.findOne({
      where: params,
      select: selectWithPassword,
      relations: ['profile', 'presence', 'peer'],
    });
  }

  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  searchUsers(query: string): Promise<User[]> {
    const statement = '(user.username LIKE :query)';
    return this.userRepository
      .createQueryBuilder('user')
      .where(statement, { query: `%${query}%` })
      .limit(10)
      .select([
        'user.username',
        'user.account',
        'user.id',
        'user.profile',
        'user.presence',
      ])
      .getMany();
  }
}

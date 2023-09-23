import { hashPassword } from 'src/utils/helpers';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/utils/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = Object.assign(createUserDto) as CreateUserDto;
    const hashPassw = await this.formatPassword(user.password);
    user.password = hashPassw;
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.userRepository.findOneBy({ name });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = Object.assign(updateUserDto) as CreateUserDto;
    if (user.password) {
      const hashPassw = await this.formatPassword(user.password);
      user.password = hashPassw;
    }
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async formatPassword(password: string) {
    const passw = password;
    const hashPasssw = await hashPassword(passw);
    return hashPasssw;
  }
}

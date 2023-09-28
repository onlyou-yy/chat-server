import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Routes } from 'src/utils/constants';
import { UsernameAlreadyExists } from '../exceptions/UsernameAlreadyExists';

@Controller(Routes.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  searchUsers(@Query('query') query: string) {
    if (!query) {
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    }
    return this.userService.searchUsers(query);
  }

  @Get('checkUsername')
  async checkUsername(@Query('username') username: string) {
    if (!username) {
      throw new HttpException('Invalid Query', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findUser({ username });
    if (user) throw new UsernameAlreadyExists();
    return HttpStatus.OK;
  }
}

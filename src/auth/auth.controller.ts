import { Body, Controller, Post, Put, Req, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SkipAuth } from './auth.decorator';
import { Request } from 'express';
import { Routes } from 'src/utils/constants';
import { UserService } from 'src/user/services/user.service';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @SkipAuth()
  @Post('login')
  async login(
    @Body() data: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const userData = await this.authService.login(data.account, data.password);
    session.user = userData.user;
    session.jwtToken = userData.access_token;
    return userData;
  }

  @SkipAuth()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put('logout')
  logout(@Req() req: Request) {
    req.session.destroy((err) => {
      console.log(err);
      if (err) {
        throw new Error('logout error');
      }
    });
    return { code: 200, errMsg: '', data: null };
  }
}

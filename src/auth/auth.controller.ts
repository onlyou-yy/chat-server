import { Body, Controller, Post, Put, Req, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SkipAuth } from './auth.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('login')
  async login(
    @Body() data: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const userData = await this.authService.login(data.name, data.password);
    session.user = userData.user;
    session.jwtToken = userData.access_token;
    return userData;
  }

  @Put('logout')
  logout(@Req() req: Request) {
    req.session.destroy((err) => {
      console.log(err);
      throw new Error('logut error');
    });
    return { code: 200, errMsg: '', data: null };
  }
}

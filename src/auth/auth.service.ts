import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { compareHash } from 'src/utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(account: string, password: string) {
    const user = await this.userService.findUser(
      { account },
      { selectAllField: true },
    );
    const userPassw = user?.password;
    const isSavePassw = await compareHash(password, userPassw);
    if (!isSavePassw) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      username: user.username,
      account: user.account,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }
}

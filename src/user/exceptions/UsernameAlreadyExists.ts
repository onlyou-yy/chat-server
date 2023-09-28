import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameAlreadyExists extends HttpException {
  constructor() {
    super('username already exists', HttpStatus.CONFLICT);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAccountAlreadyExists extends HttpException {
  constructor() {
    super('User account already exists', HttpStatus.CONFLICT);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupNotFoundException extends HttpException {
  constructor() {
    super('Group not Found', HttpStatus.NOT_FOUND);
  }
}

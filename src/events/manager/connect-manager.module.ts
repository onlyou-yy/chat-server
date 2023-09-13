import { Global, Module } from '@nestjs/common';
import { ConnectManagerService } from './connect-manager.service';

@Global()
@Module({
  providers: [ConnectManagerService],
  exports: [ConnectManagerService],
})
export class ConnectManagerModule {}

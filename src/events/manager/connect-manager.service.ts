import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ConnectManagerService {
  connectUsers: Map<string, Socket> = new Map();

  saveSocekt(client: Socket) {
    this.connectUsers.set(client.id, client);
  }

  getSocekt(id: string) {
    return this.connectUsers.get(id);
  }

  removeSocekt(id: string) {
    this.connectUsers.delete(id);
  }

  disconnect(id: string) {
    const client = this.connectUsers.get(id);
    client.disconnect();
    this.removeSocekt(id);
  }
}

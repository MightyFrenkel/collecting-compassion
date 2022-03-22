import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Image } from 'src/models/image';

@WebSocketGateway()
export class EventsGateway {

@WebSocketServer()
server: Server;

  public sendImage(data: Image) {
    this.server.emit("newimage", data);
  }
}

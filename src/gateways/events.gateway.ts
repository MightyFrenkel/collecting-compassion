import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Image } from 'src/models/image';

@WebSocketGateway()
export class EventsGateway {

@WebSocketServer()
server: Server;

  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): string {
    console.log(client.id);
    this.sendImage(payload);
    
    return 'Hello world!';
  }

  public sendImage(data: Image) {
    this.server.emit("events", data);
  }
}

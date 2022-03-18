import { Server } from 'socket.io';
import { Image } from 'src/models/image';
export declare class EventsGateway {
    server: Server;
    handleMessage(client: any, payload: any): string;
    sendImage(data: Image): void;
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { join } from 'path';
import { EventsGateway } from './gateways/events.gateway';
import { ImageService } from './services/image/image.service';
import { ImageController } from './controllers/image/image.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client/dist'),
    }),
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, EventsGateway, ImageService],
})
export class AppModule {}

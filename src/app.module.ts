import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { join } from 'path';
import { EventsGateway } from './gateways/events.gateway';
import { ImageService } from './services/image/image.service';
import { ImageController } from './controllers/image/image.controller';
import { S3Service } from './services/s3/s3.service';
import { PgService } from './services/pg/pg.service';
import { TelegramService } from './services/telegram/telegram.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    HttpModule
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, EventsGateway, ImageService, S3Service, PgService, TelegramService],
})
export class AppModule {}

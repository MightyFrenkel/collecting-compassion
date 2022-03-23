import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/gateways/events.gateway';
import { Image } from 'src/models/image';
import { PgService } from '../pg/pg.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ImageService {
    private images: Image[] = [];

    constructor(private readonly s3Service: S3Service, private readonly pgSerivce: PgService, private readonly eventGateway: EventsGateway) { }

    public async addImage(image: Image) {
        this.images.push(image);
        const newImg = await this.s3Service.uploadImage(image);
        
        await this.pgSerivce.addImageToDb(newImg);
        this.eventGateway.sendImage(newImg);
    }

    public async getAllImages(filterColor: string = "") {
        return await this.pgSerivce.getAllImages(filterColor);
    }
}

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
        const id = await this.s3Service.uploadImage(image);
        await this.pgSerivce.addImageToDb({ id: id, url: 'https://support-ukraine.s3.eu-west-3.amazonaws.com/' + id } as Image);
        this.eventGateway.sendImage(image);
    }

    public async getAllImages() {
        return await this.pgSerivce.getAllImages();
    }
}

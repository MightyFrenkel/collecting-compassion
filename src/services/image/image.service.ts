import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ImageService {
    private images: Image[] = [];

    constructor(private readonly s3Service: S3Service) {}

    public async addImage(image: Image) {
        this.images.push(image);
        await this.s3Service.uploadImage(image);
        console.log(this.images.length);
    }

    public getAllImages() {
        return this.images;
    }
}

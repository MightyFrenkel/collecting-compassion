import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';

@Injectable()
export class ImageService {
    private images: Image[] = [];

    public addImage(image: Image) {
        this.images.push(image);
        console.log(this.images.length);
    }

    public getAllImages() {
        return this.images;
    }
}

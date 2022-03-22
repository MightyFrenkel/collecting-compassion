import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsGateway } from 'src/gateways/events.gateway';
import { Image } from 'src/models/image';
import { ImageService } from 'src/services/image/image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('all')
    async getAllImages() {
        return await this.imageService.getAllImages();
    }

    @Post('new')
    async uploadImage(@Body() image: Image) {
        //console.log(image);
        await this.imageService.addImage(image);
        return 'succes!';
    }
}

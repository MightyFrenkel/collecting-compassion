import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Image } from 'src/models/image';
import { ImageService } from 'src/services/image/image.service';

@Controller('image')

export class ImageController {
    constructor(private readonly imageService: ImageService) {}
    @Get('all/:filter?')
    async getAllImages(@Param() params) {
        return await this.imageService.getAllImages(params.filter);
    }

    @Post('new')
    @UseGuards(AuthGuard)
    async uploadImage(@Body() image: Image) {
        //console.log(image);
        await this.imageService.addImage(image);
        return 'succes!';
    }
}

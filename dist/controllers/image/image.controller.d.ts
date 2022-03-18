import { EventsGateway } from 'src/gateways/events.gateway';
import { Image } from 'src/models/image';
import { ImageService } from 'src/services/image/image.service';
export declare class ImageController {
    private readonly imageService;
    private readonly eventGateway;
    constructor(imageService: ImageService, eventGateway: EventsGateway);
    getAllImages(): Image[];
    uploadImage(image: Image): string;
}

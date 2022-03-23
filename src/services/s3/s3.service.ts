import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';
import settings from "./aws";
import { s3Client } from './client';
import { randomUUID } from 'crypto'


@Injectable()
export class S3Service {

    async uploadImage(image: Image) {
        const uuid = randomUUID();
        console.log(uuid);
        const params = {
            Bucket: settings.AWS_BUCKET_NAME,
            Key: uuid,
            Body: Buffer.from(image.base64.replace(/^data:.+;base64,/, ""), 'base64'),
            ACL: "public-read",
            ContentType: "image/png"
        };
        try {
            const data = await s3Client.send(new PutObjectCommand(params))
            console.log("succes!", data);
            image.id = uuid;
            image.url = 'https://support-ukraine.s3.eu-west-3.amazonaws.com/' + uuid;
            
            return image;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}

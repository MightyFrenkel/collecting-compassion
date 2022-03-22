import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';
import { pool } from "./pool";


@Injectable()
export class PgService {

    public async addImageToDb(image: Image) {
        pool.connect();
        const values = [image.id, image.url]
        try {
            await pool.query('INSERT INTO images (id, url) VALUES ($1, $2)', values);
            pool.end();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getAllImages() {
        pool.connect();

        try {
            const res = await pool.query('SELECT id, url FROM images WHERE visible = true');
            for (let row of res.rows) {
                console.log(JSON.stringify(row));
            };
            return res.rows as Image[];
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            pool.end();
        }

    }
}
import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';
import { pool } from "./pool";


@Injectable()
export class PgService {

    public async addImageToDb(image: Image) {
        const values = [image.id, image.url, image.color]
        try {
            await pool.query('INSERT INTO images (id, url, color) VALUES ($1, $2, $3)', values);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getAllImages(filterColor: string) {
        try {
            const query = 'SELECT id, url, color, date FROM images WHERE visible = true' + (filterColor ? ' and color = $1' : '') + ' order by date asc';
            const values = [];
            if (filterColor) values.push(filterColor);
            const res = await pool.query(query, values);
            for (let row of res.rows) {
                console.log(JSON.stringify(row));
            };
            return res.rows as Image[];
        }
        catch (error) {
            console.log(error);
            throw error;
        }

    }
}
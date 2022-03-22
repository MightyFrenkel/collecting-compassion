import { Injectable } from '@nestjs/common';
import { Image } from 'src/models/image';
const { Client } = require('pg');



@Injectable()
export class PgService {

    public async addImageToDb(image: Image) {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        client.connect();
        const values = [image.id, image.url]
        try {
            await client.query('INSERT INTO images (id, url) VALUES ($1, $2)', values);
            client.end();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getAllImages() {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        client.connect();

        try {
            const res = await client.query('SELECT id, url FROM images WHERE visible = true');
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
            client.end();
        }

    }
}
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { TG_BOT_ID } from 'src/config';

@Injectable()
export class TelegramService {
    chat_id = -510152017;

    constructor(private httpService: HttpService) {
        
    }
    sendPhoto(src: string, caption: string): Observable<AxiosResponse> {
        return this.httpService.post("https://api.telegram.org/bot" + TG_BOT_ID + "/sendPhoto", 
        {
            chat_id: this.chat_id,
            photo: src,
            caption: caption
        })
    }
}

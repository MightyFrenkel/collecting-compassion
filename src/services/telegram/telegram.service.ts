import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class TelegramService {
    chat_id = -510152017;
    bot_id = "5210190651:AAFxzEaWO13ndEwoAZHCC8TfwV2sKz7eZFE"

    constructor(private httpService: HttpService) {
        
    }
    sendPhoto(src: string, caption: string): Observable<AxiosResponse> {
        return this.httpService.post("https://api.telegram.org/bot" + this.bot_id + "/sendPhoto", 
        {
            chat_id: this.chat_id,
            photo: src,
            caption: caption
        })
    }
}

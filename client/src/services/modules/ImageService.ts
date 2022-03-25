import axios from "axios";
import type { Image } from "@/models/image";

export const sendImage = (image: Image, password: string) => {
    const config = {
        headers: {
            "Content-type": "application/json",
              "Authorization": password,
        },
    };
    return axios.post('/api/image/new',
        {
            base64: image.base64,
            color: image.color
        }, config)
        .then(response => {
            console.log(response);
            return Promise.resolve(response);
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(error);
        })
}

export const getAllImages = (colorFilter: string = "") => {
    return axios.get('/api/image/all' + (colorFilter ? '/' + colorFilter : ''))
    .then(response => {
        return Promise.resolve(response.data);
    })
    .catch(error => {
        return Promise.reject(error);
    })
}
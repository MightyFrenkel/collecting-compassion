import axios from "axios";

export const sendImage = (base64: string) => {
    return axios.post('/api/image/new',
        {
            base64: base64
        })
        .then(response => {
            console.log(response);
            return Promise.resolve(response);
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(error);
        })
}

export const getAllImages = () => {
    return axios.get('/api/image/all')
    .then(response => {
        return Promise.resolve(response.data);
    })
    .catch(error => {
        return Promise.reject(error);
    })
}
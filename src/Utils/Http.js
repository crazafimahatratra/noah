import axios from 'axios';
import { Env } from '../Env';

export default class Http {
    headers() {
        let header = {
            'Content-Type': 'application/json',
        }
        let token = localStorage.getItem('accessToken');
        if(token) {
            header['Authorization'] = `Bearer ${token}`;
        }
        return header;
    }

    post(url, data) {
        return axios.post(`${Env.ApiEndpoint}/${url}`, data, {headers: this.headers()});
    }

    get(url) {
        return axios.get(`${Env.ApiEndpoint}/${url}`, {headers: this.headers()})
    }

    put(url, data) {
        return axios.put(`${Env.ApiEndpoint}/${url}`, data, {headers: this.headers()});
    }

    delete(url) {
        return axios.delete(`${Env.ApiEndpoint}/${url}`, {headers: this.headers()})
    }
}

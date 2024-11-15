import axios from 'axios';
import { ACCESS_TOKEN } from './constants';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
// all we need to do is specify the path we want to access. We dont need to specify the base url

api.interceptors.request.use(
    (config) => {
        // we gonna accept the config func, and look in our local storage and see if we have access_token
        // if we do, add it as an auth-header to our reqs else, nothing to do
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api;
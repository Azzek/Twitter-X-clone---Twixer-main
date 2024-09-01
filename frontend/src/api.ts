import axios from "axios";
import { ACCES_TOKEN } from "@/constans";

const api = axios.create({
    baseURL: 'http://localhost:8000'
})

const setAuthToken = api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCES_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }                   
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
export {setAuthToken, api}
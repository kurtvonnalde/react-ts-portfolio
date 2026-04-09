import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
});
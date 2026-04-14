import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export const adminApi = axios.create({
    baseURL
});

let adminToken: string | null = null;

export function setAdminToken(token: string | null) {
    adminToken = token;
}

adminApi.interceptors.request.use((config)=>{
    if (adminToken) {
        config.headers = config.headers ?? {};
        config.headers["x-admin-key"] = adminToken;
    }
    return config;
});
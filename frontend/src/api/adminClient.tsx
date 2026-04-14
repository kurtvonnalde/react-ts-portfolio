import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = rawBaseURL || window.location.origin;

if (import.meta.env.PROD && !rawBaseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not set in production. Configure it in your deployment build environment.'
  );
}

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
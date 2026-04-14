import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = rawBaseURL || window.location.origin;

if (import.meta.env.PROD && !rawBaseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not set in production. Configure it in your deployment build environment.'
  );
}

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
});
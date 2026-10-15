import axios from 'axios';
import { env } from './env';

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use((response) => response.data);

import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use((response) => response.data);

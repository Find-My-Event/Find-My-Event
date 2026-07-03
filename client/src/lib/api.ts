import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.29.168:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t === 'mock_token') {
    return Promise.reject(new axios.Cancel('Mock token bypass'));
  }
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

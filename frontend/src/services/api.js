import axios from 'axios';
import {jwtDecode, } from 'jwt-decode';


const BASE_URL = 'https://16.171.44.132/tracker/v1/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
        localStorage.setItem('access', res.data.access);

        // Update headers and retry original request
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed', err);
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
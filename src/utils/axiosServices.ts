// src/utils/axiosServices.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosServices = axios.create({
  baseURL: process.env.Development_BackEnd_Url,
  // baseURL: 'http://localhost:3000',
});

axiosServices.defaults.withCredentials = true;

axiosServices.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default axiosServices;

// src/utils/axiosServices.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Skip interceptor for login endpoint (let login page handle its own errors)
    const isAuthEndpoint = requestUrl.includes('/api/auth/login');

    // Handle 401 (Unauthorized - token missing) or 403 (Forbidden - token expired/invalid)
    // But not for auth endpoints
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      // Clear all auth data
      Cookies.remove('token', { path: '' });
      Cookies.remove('user', { path: '' });
      Cookies.remove('userRole', { path: '' });
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // Show SweetAlert warning and redirect to login
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please login first',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/auth/login';
        }
      });
    }

    return Promise.reject(error);
  },
);

export default axiosServices;

// src/utils/axiosServices.ts

import axios from 'axios';
import Cookies from 'js-cookie';

const axiosServices = axios.create({
  baseURL: 'http://localhost:3000', 
  // أو تمررها من ملف env
  // baseURL: process.env.REACT_APP_API_BASE_URL
});

// نسمح بإرسال الكوكيز تلقائياً مع الطلبات في حال كان السيرفر يدعم CORS
axiosServices.defaults.withCredentials = true;

// Interceptor لإضافة التوكن في Authorization
axiosServices.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // قراءة الكوكي
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor لمعالجة الأخطاء أو الاستجابة
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // يمكنك إضافة لوجيك لمعالجة الأخطاء هنا
    return Promise.reject(error);
  }
);

export default axiosServices;

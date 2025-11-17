/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authService.ts
import axiosServices from 'src/utils/axiosServices';

interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    Id: string;
    FName: string;
    LName: string;
    Email: string;
    UserName: string;
    Password: string;
    userImg_Url: string | null;
    is_Active: number;
    User_contact: any[]; // أو اكتب واجهة مناسبة لبيانات الاتصالات
  };
  userRole: string;
}

// طلب تسجيل الدخول
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await axiosServices.post<LoginResponse>('/api/auth/login', credentials);
  return data;
};

// طلب تسجيل الخروج (حسب الـ API؛ مجرد GET)
export const logoutApi = async (): Promise<{ message: string }> => {
  const { data } = await axiosServices.get('/api/auth/logout');
  return data;
};

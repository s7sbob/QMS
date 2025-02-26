// src/services/userService.ts

import axiosServices from 'src/utils/axiosServices';

/**
 * واجهة بيانات الاتصالات الخاصة بالمستخدم
 */
export interface IUserContact {
  Id: string;
  Emp_Id: string; // يربط الـ Contact بالمستخدم
  PhoneNumber?: string;
  address?: string;
}

/**
 * واجهة بيانات المستخدم العائدة من الـ API
 */
export interface IUser {
  Id: string;
  FName: string;
  LName: string;
  Email: string;
  UserName: string;
  Password: string;
  userImg_Url?: string | null;
  is_Active?: number;        // <--- مضاف
  dateOfBirth?: string;      // إن كان متاحًا في الجدول
  User_contact?: IUserContact[];
}

/**
 * واجهة بيانات الإدخال عند إضافة / تعديل مستخدم
 * (تطابق /api/users/addEditUser في الـ OpenAPI)
 */
export interface UserInput {
  Id?: string; // إذا أُرسِل، يتم تعديل المستخدم
  FName: string;
  LName: string;
  Email: string;
  UserName: string;
  Password: string;
  userImg_Url?: string; 
  dateOfBirth?: string;
  is_Active?: number;   // <--- مضاف
  contacts?: Array<{
    PhoneNumber: string;
    address: string;
  }>;
}

/**
 * جلب جميع المستخدمين
 * GET /api/users
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  const { data } = await axiosServices.get('/api/users');
  return data;
};

/**
 * جلب مستخدم عن طريق id أو Email
 * GET /api/users/getUser?id=xxx أو ?Email=xxx
 */
export const getUser = async (params: { id?: string; Email?: string }): Promise<IUser> => {
  const query = new URLSearchParams();
  if (params.id) query.append('id', params.id);
  if (params.Email) query.append('Email', params.Email);

  const { data } = await axiosServices.get(`/api/users/getUser?${query.toString()}`);
  return data;
};

/**
 * إضافة أو تعديل مستخدم
 * POST /api/users/addEditUser
 */
export const addEditUserApi = async (userData: UserInput) => {
  const { data } = await axiosServices.post('/api/users/addEditUser', userData);
  return data; // يحتوي على { message, user }
};

/**
 * حذف (Soft Delete) مستخدم
 * DELETE /api/users/delete/{id}
 */
export const deleteUser = async (id: string) => {
  const { data } = await axiosServices.delete(`/api/users/delete/${id}`);
  return data; // قد يحتوي على user محذوف أو message
};

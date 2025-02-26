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
  is_Active?: number;
  User_contact?: IUserContact[];
  dateOfBirth?: string; // أضفناها لتفادي الأخطاء
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
  userImg_Url?: string; // لو أردت رفع صورة أو URL
  dateOfBirth?: string; // لو ترغب بإرساله
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
 * جلب مستخدم عن طريق الـ ID
 * GET /api/users/id/{id}
 */
export const getUserById = async (id: string): Promise<IUser> => {
  const { data } = await axiosServices.get(`/api/users/id/${id}`);
  return data;
};

/**
 * جلب مستخدم عن طريق الـ Username
 * GET /api/users/userName/{userName}
 */
export const getUserByUserName = async (userName: string): Promise<IUser> => {
  const { data } = await axiosServices.get(`/api/users/userName/${userName}`);
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

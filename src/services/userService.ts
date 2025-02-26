// src/services/userService.ts
import axiosServices from 'src/utils/axiosServices';

interface UserInput {
  Id?: string;
  FName: string;
  LName: string;
  Email: string;
  UserName: string;
  Password: string;
  contacts?: Array<{
    PhoneNumber: string;
    address: string;
  }>;
}

// إضافة/تحديث مستخدم
export const addEditUserApi = async (userData: UserInput) => {
  const { data } = await axiosServices.post('/api/users/addEditUser', userData);
  return data; // يحتوي على message و user (حسب الـ OpenAPI)
};

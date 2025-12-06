// src/services/userService.ts

import axiosServices from 'src/utils/axiosServices';

export interface IUserContact {
  Id: string;
  Emp_Id: string;
  PhoneNumber?: string;
  address?: string;
}

export interface ICompany {
  Id: string;
  Name: string;
  // Additional company properties if needed
}

export interface IUser {
  Id: string;
  FName: string;
  LName: string;
  Email: string;
  UserName: string;
  Password: string;
  userImg_Url?: string | null;
  signUrl?: string;
  is_Active?: number;
  dateOfBirth?: string;
  User_contact?: IUserContact[];
  // Added property for user-department relation
  Users_Departments_Users_Departments_User_IdToUser_Data?: any[];
  // Company data array
  Comp_Data?: ICompany[];
}

export interface UserInput {
  Id?: string;
  FName: string;
  LName: string;
  Email: string;
  UserName: string;
  Password: string;
  userImg?: string;
  signUrl?: string;
  userImg_Url?: string;
  dateOfBirth?: string;
  is_Active?: number;
  contacts?: Array<{
    PhoneNumber: string;
    address: string;
  }>;
}

export const getAllUsers = async (): Promise<IUser[]> => {
  const { data } = await axiosServices.get('/api/users/getUsers');
  return data;
};

export const getUser = async (params: { id?: string; Email?: string }): Promise<IUser> => {
  const query = new URLSearchParams();
  if (params.id) query.append('id', params.id);
  if (params.Email) query.append('Email', params.Email);

  const { data } = await axiosServices.get(`/api/users/getUser?${query.toString()}`);
  return data;
};

export const addEditUserApi = async (userData: FormData) => {
  const { data } = await axiosServices.post('/api/users/addEditUser', userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await axiosServices.delete(`/api/users/delete/${id}`);
  return data; // May contain the deleted user or a message
};

export const getAllCompanies = async (): Promise<ICompany[]> => {
  const { data } = await axiosServices.get('/api/companies/getAllCompanies');
  return data;
};

export const getDepartmentsByCompany = async (companyId: string): Promise<any[]> => {
  const { data } = await axiosServices.get(`/api/department/compdepartments/${companyId}`);
  return data;
};

export const getDepartment = async (id: string): Promise<any> => {
  const { data } = await axiosServices.get(`/api/department/getdepartment/${id}`);
  return data;
};

export const getAllUserRoles = async (): Promise<any[]> => {
  const { data } = await axiosServices.get('/api/userroles/getAll');
  return data;
};

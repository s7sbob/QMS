// src/services/userService.ts

import axiosServices from 'src/utils/axiosServices';

export interface IUserContact {
  Id: string;
  Emp_Id: string;
  PhoneNumber?: string;
  address?: string;
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
  const { data } = await axiosServices.get('/api/users');
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
  return data; // قد يحتوي على user محذوف أو message
};

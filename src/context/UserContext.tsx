// src/context/UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface IUser {
  Id: string;
  FName: string;
  LName: string;
  DateOfBirth: string | null;
  CrtDate: string;
  UserName: string;
  Email: string;
  userImg_Url: string | null;
  signUrl: string | null;
  is_Active: number;
  compId: string;
  companyName?: string;
  // بيانات العلاقات الأخرى إن وجدت
  Users_Departments_Users_Departments_User_IdToUser_Data?: any[];
  Comp_Data?: any[];
  userRole?: any[];
  [key: string]: any;
}

export const UserContext = createContext<IUser | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const loadUserFromCookie = () => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const parsedUser: IUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Load user data once on startup
    loadUserFromCookie();
    // Removed polling - user must refresh page if data changes
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

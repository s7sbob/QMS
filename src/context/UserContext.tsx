import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

interface IUser {
  userId: string;
  email: string;
  userName: string;
  userFirstName: string;
  userRole: string;
  departmentId: string;
  compId: string;
  // يمكن إضافة خصائص أخرى حسب الحاجة
  [key: string]: any;
}

export const UserContext = createContext<IUser | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("UserContext: Retrieved token:", token);
    if (token) {
      try {
        const decoded: IUser = jwtDecode(token);
        console.log("UserContext: Decoded token:", decoded);
        setUser(decoded);
      } catch (error) {
        console.error('UserContext: Error decoding token:', error);
      }
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

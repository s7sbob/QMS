// src/guards/AuthGuard.tsx (مثال)

import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // نقرأ التوكن من الكوكيز
  const token = Cookies.get('token'); 

  // يمكنك إضافة أي لوجيك إضافي مثل استدعاء API للتحقق من صلاحية التوكن
  // أو الاعتماد على مجرد وجود التوكن.

  if (!token) {
    // لو التوكن غير موجود => إعادة توجيه
    return <Navigate to="/auth/login" replace />;
  }

  // لو التوكن موجود => السماح بالوصول
  return <>{children}</>;
};

export default AuthGuard;

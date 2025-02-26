// src/pages/Users.tsx

import React, { useEffect, useState } from 'react';
import { Button, Box, Drawer, useMediaQuery, Theme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AppCard from 'src/components/shared/AppCard';

// المكونات
import UserFilter from './UserFilter';
import UserSearch from './UserSearch';
import UserAdd from './UserAdd';
import UserList from './UserList';
import UserDetails from './UserDetails';

// الخدمات
import { IUser, getAllUsers } from 'src/services/userService';

const drawerWidth = 240;
const secdrawerWidth = 320;

const Users: React.FC = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);

  // قائمة المستخدمين من الـ API
  const [users, setUsers] = useState<IUser[]>([]);

  // المستخدم المحدد لعرض تفاصيله
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // **** حالات البحث والفلترة ****
  const [searchTerm, setSearchTerm] = useState('');      // نص البحث
  const [filterActive, setFilterActive] = useState(true);   // عرض الفعّالين؟
  const [filterInactive, setFilterInactive] = useState(true); // عرض غير الفعّالين؟

  // للتحكم بالتصميم الاستجابي
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  // جلب المستخدمين مرة واحدة عند تحميل الصفحة
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // عند الضغط على مستخدم في القائمة
  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    setRightSidebarOpen(true);
  };

  // إغلاق الشريحة اليمنى
  const handleCloseRightSidebar = () => {
    setRightSidebarOpen(false);
    setSelectedUser(null);
  };

  // *********** منطق البحث ***********
  // فلترة أولية بالبحث (بالاسم أو الإيميل)
  const usersSearched = users.filter((user) => {
    const fullName = (user.FName + ' ' + user.LName).toLowerCase();
    const email = (user.Email || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    // إذا الكلمة موجودة في الاسم أو الإيميل
    return fullName.includes(term) || email.includes(term);
  });

  // *********** منطق الفلترة (Active/Inactive) ***********
  const filteredUsers = usersSearched.filter((user) => {
    // لو user.is_Active = 1 لكنه غير مفعّل في الفلتر => إخفاؤه
    if (user.is_Active === 1 && !filterActive) return false;
    // لو user.is_Active = 0 لكنه غير مفعّل في الفلتر => إخفاؤه
    if (user.is_Active === 0 && !filterInactive) return false;
    return true;
  });

  return (
    <PageContainer title="Users App" description="User Management">
      <Breadcrumb title="Users App" subtitle="List Your Users" />
      <AppCard>
        {/* الشريحة اليسرى (UserFilter) */}
        <Drawer
          open={isLeftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              position: 'relative',
              zIndex: 2,
            },
            flexShrink: 0,
          }}
          variant={lgUp ? 'permanent' : 'temporary'}
        >
          {/*
            نمرر قيم الفلترة وحالة التحكم فيها:
            - filterActive / setFilterActive
            - filterInactive / setFilterInactive
          */}
          <UserFilter
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            filterInactive={filterInactive}
            setFilterInactive={setFilterInactive}
          />
        </Drawer>

        {/* الجزء الأوسط: (بحث + إضافة مستخدم + لائحة المستخدمين) */}
        <Box
          sx={{
            minWidth: secdrawerWidth,
            width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
            flexShrink: 0,
          }}
        >
          {/* مكون البحث:
              نمرر دالة لتحديث searchTerm وأيضًا onClick لفتح الشريحة اليسرى
           */}
          <UserSearch
            onClick={() => setLeftSidebarOpen(true)}
            onSearchChange={(val) => setSearchTerm(val)}
          />

          <UserAdd onUserAdded={loadUsers} />

          {/* نمرر القائمة المُرشّحة فقط إلى UserList */}
          <UserList users={filteredUsers} onSelectUser={handleSelectUser} />
        </Box>

        {/* الشريحة اليمنى (تفاصيل المستخدم) */}
        <Drawer
          anchor="right"
          open={isRightSidebarOpen}
          onClose={handleCloseRightSidebar}
          variant={mdUp ? 'permanent' : 'temporary'}
          sx={{
            width: mdUp ? secdrawerWidth : '100%',
            zIndex: lgUp ? 0 : 1,
            flex: mdUp ? 'auto' : '',
            [`& .MuiDrawer-paper`]: { width: '100%', position: 'relative' },
          }}
        >
          {/* زر للإغلاق على الشاشات الصغيرة */}
          {!mdUp && (
            <Box sx={{ p: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleCloseRightSidebar}
                sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}
              >
                Back
              </Button>
            </Box>
          )}
          {/* تفاصيل المستخدم المختار */}
          <UserDetails user={selectedUser} />
        </Drawer>
      </AppCard>
    </PageContainer>
  );
};

export default Users;

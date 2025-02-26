// src/pages/Users.tsx

import React, { useEffect, useState } from 'react';
import { Button, Box, Drawer, useMediaQuery, Theme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AppCard from 'src/components/shared/AppCard';

// مكونات الفلاتر والبحث والإضافة واللائحة والتفاصيل
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

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  // جلب المستخدمين من السيرفر
  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // أول ما تفتح الصفحة أو تتغير ظروفها, يجلب البيانات مرة واحدة
  useEffect(() => {
    loadUsers();
  }, []);

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
            [`& .MuiDrawer-paper`]: { width: drawerWidth, position: 'relative', zIndex: 2 },
            flexShrink: 0,
          }}
          variant={lgUp ? 'permanent' : 'temporary'}
        >
          <UserFilter />
        </Drawer>

        {/* الوسط: (بحث + إضافة مستخدم + لائحة المستخدمين) */}
        <Box
          sx={{
            minWidth: secdrawerWidth,
            width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
            flexShrink: 0,
          }}
        >
          <UserSearch onClick={() => setLeftSidebarOpen(true)} />
          {/* نمرر دالة loadUsers لإعادة التحميل بعد إضافة مستخدم جديد */}
          <UserAdd onUserAdded={loadUsers} />
          <UserList users={users} onSelectUser={handleSelectUser} />
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
          {mdUp ? (
            ''
          ) : (
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
          <UserDetails user={selectedUser} />
        </Drawer>
      </AppCard>
    </PageContainer>
  );
};

export default Users;

// src/pages/Users.tsx
import React, { useState } from 'react';
import { Button, Box, Drawer, useMediaQuery, Theme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AppCard from 'src/components/shared/AppCard';
import UserFilter from './UserFilter';
import UserSearch from './UserSearch';
import UserAdd from './UserAdd';
import UserList from './UserList';
import UserDetails from './UserDetails';
import sampleUsers from 'src/data/sampleUsers';

const drawerWidth = 240;
const secdrawerWidth = 320;

const Users: React.FC = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return (
    <PageContainer title="Users App" description="User Management">
      <Breadcrumb title="Users App" subtitle="List Your Users" />
      <AppCard>
        {/* Left Sidebar (Filter) */}
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
        {/* Middle Part (Search + Add New User + List) */}
        <Box
          sx={{
            minWidth: secdrawerWidth,
            width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
            flexShrink: 0,
          }}
        >
          <UserSearch onClick={() => setLeftSidebarOpen(true)} />
          <UserAdd />
          <UserList users={sampleUsers} showrightSidebar={() => setRightSidebarOpen(true)} />
        </Box>
        {/* Right Sidebar (User Details) */}
        <Drawer
          anchor="right"
          open={isRightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
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
                onClick={() => setRightSidebarOpen(false)}
                sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}
              >
                Back
              </Button>
            </Box>
          )}
          <UserDetails />
        </Drawer>
      </AppCard>
    </PageContainer>
  );
};

export default Users;

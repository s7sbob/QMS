// src/layouts/full/vertical/auth/authForms/Profile.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, Stack } from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import { UserContext } from 'src/context/UserContext';

const Profile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // الآن نستخدم userRole مباشرة من الـ context لعرض المسمى الوظيفي
  const jobTitle = user?.userRole || 'Job Title';

  const handleLogout = () => {
    try {
      // إزالة كل الكوكيز
      Cookies.remove('user', { path: '' });
      Cookies.remove('token', { path: '' });
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          ...(anchorEl && { color: 'primary.main' }),
        }}
      >
        <Avatar
          src={user?.userImg_Url || '/default-profile.jpg'} // صورة افتراضية في حال عدم توفر الصورة
          alt="Profile"
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={user?.userImg_Url || '/default-profile.jpg'}
            alt="Profile"
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {user ? `${user.FName} ${user.LName}` : 'User'}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {jobTitle}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.Email || 'email@example.com'}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

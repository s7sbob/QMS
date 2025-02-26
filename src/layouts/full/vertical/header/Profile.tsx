/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, Stack } from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';

// استيراد مكتبة الكوكيز
import Cookies from 'js-cookie';

// لو عندك دالة logoutApi لاستدعاء /api/auth/logout من السيرفر، استوردها هنا
// import { logoutApi } from 'src/services/authService';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      // لو أردت استدعاء Endpoint الخروج من السيرفر، قم بإلغاء التعليق واستدعِ logoutApi:
      // await logoutApi();

      // إزالة التوكن من الكوكي
      Cookies.remove('token');

      // إعادة توجيه المستخدم لصفحة تسجيل الدخول
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // يمكنك عرض رسالة خطأ أو أي إجراء آخر
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl2 && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt="ProfileImg"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
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
          <Avatar src={ProfileImg} alt="ProfileImg" sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              Mathew Anderson
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Designer
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              info@modernize.com
            </Typography>
          </Box>
        </Stack>
        <Divider />

        {/* يمكنك إضافة أي عناصر أخرى هنا حسب رغبتك */}
        <Box mt={2}>
          {/* عند الضغط على الزر سيتم تنفيذ handleLogout */}
          <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

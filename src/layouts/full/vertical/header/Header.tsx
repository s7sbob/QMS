// src/layouts/full/vertical/header/Header.tsx
import React from 'react';
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
  Theme,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'src/store/Store';
import { toggleMobileSidebar, setDarkMode } from 'src/store/customizer/CustomizerSlice';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import Notifications from './Notification';
import Cart from './Cart';
import Profile from './Profile';
import Search from './Search';
import Language from './Language';
import Navigation from './Navigation';
import AppDD from './Navigation'; // القائمة الأصلية للـ "Apps"
import ActionDD from './ActionDD'; // القائمة الخاصة بالـ "Action"
import Logo from 'src/layouts/full/shared/logo/Logo';
import { AppState } from 'src/store/Store';

const Header = () => {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const location = useLocation();

  // تحديد ما إذا كان المستخدم داخل قسم الوثائق
  const isDocumentation = location.pathname.startsWith('/documentation-control');

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: '0 auto',
    width: '100%',
    color: `${theme.palette.text.secondary} !important`,
  }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
        }}
      >
        <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
          <Logo />
        </Box>
        {lgDown && (
          <IconButton color="inherit" aria-label="menu" onClick={() => dispatch(toggleMobileSidebar())}>
            <IconMenu2 />
          </IconButton>
        )}
        <Search />
        {/* إذا كان المستخدم داخل قسم الوثائق، نعرض ActionDD بدلاً من AppDD */}
        {lgUp && isDocumentation ? <ActionDD /> : lgUp && <AppDD />}
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Language />
          <Cart />
          <IconButton size="large" color="inherit">
            {customizer.activeMode === 'light' ? (
              <IconMoon size="21" stroke="1.5" onClick={() => dispatch(setDarkMode('dark'))} />
            ) : (
              <IconSun size="21" stroke="1.5" onClick={() => dispatch(setDarkMode('light'))} />
            )}
          </IconButton>
          <Notifications />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;

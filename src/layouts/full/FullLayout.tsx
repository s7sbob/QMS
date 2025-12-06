// src/layouts/full/FullLayout.tsx
import { FC } from 'react';
import { styled, Container, Box, useTheme } from '@mui/material';
import { useSelector } from 'src/store/Store';
import { Outlet } from 'react-router-dom';
import { AppState } from 'src/store/Store';
import Header from './vertical/header/Header';
import Sidebar from './vertical/sidebar/Sidebar';
import Customizer from './shared/customizer/Customizer';
import Navigation from '../full/horizontal/navbar/Navigation';
import HorizontalHeader from '../full/horizontal/header/Header';
import AppFooter from './shared/footer/AppFooter';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  width: '100%',
  backgroundColor: 'transparent',
}));

const FullLayout: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  return (
    <MainWrapper className={customizer.activeMode === 'dark' ? 'darkbg mainwrapper' : 'mainwrapper'}>
      {/* نغلف Sidebar داخل Box لتطبيق فئة no-print */}
      {customizer.isHorizontal ? '' : <Box className="no-print"><Sidebar /></Box>}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up('lg')]: { ml: `${customizer.MiniSidebarWidth}px` },
          }),
        }}
      >
        {/* نغلف Header/HorizontalHeader و Navigation داخل Box مع فئة no-print */}
        {customizer.isHorizontal ? (
          <Box className="no-print"><HorizontalHeader /></Box>
        ) : (
          <Box className="no-print"><Header /></Box>
        )}
        {customizer.isHorizontal ? <Box className="no-print"><Navigation /></Box> : null}
        <Container
          sx={{
            pt: '30px',
            maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
          {/* المحتوى الذي تريد طباعته */}
          <Box id="printable" sx={{ minHeight: 'calc(100vh - 170px)' }}>
            <Outlet />
          </Box>
        </Container>
        <Box className="no-print"><Customizer /></Box>
        <AppFooter />
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;

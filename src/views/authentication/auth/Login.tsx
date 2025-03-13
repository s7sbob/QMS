// src/layouts/full/vertical/auth/Login2.tsx

import React from 'react';
import { Grid, Box, Card, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';

const Login2: React.FC = () => {
  return (
    <PageContainer title="Login" description="This is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: 0.3,
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Logo />
              </Box>

              {/* مكوّن الفورم الخاص بتسجيل الدخول */}
              <AuthLogin />

              {/* رابط الانتقال إلى صفحة التسجيل */}
              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don’t have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/auth/register"
                    sx={{
                      textDecoration: 'none',
                      fontWeight: '500',
                      color: 'primary.main',
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;

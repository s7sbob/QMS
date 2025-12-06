// src/pages/Dashboard.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box, styled, useTheme, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllModules } from 'src/config/dashboardConfig';
import { getIconComponent } from 'src/utils/iconUtils';
import { DashboardModule } from 'src/types/dashboard.types';

const DashboardCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const IconWrapper = styled(Box)(({ theme }: { theme: Theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const modules: DashboardModule[] = getAllModules();
  
  return (
    <Box sx={{ p: theme.spacing(3) }}>
      <Typography 
        variant="h1" 
        align="center" 
        sx={{ 
          mb: theme.spacing(4), 
          color: theme.palette.text.primary 
        }}
      >
        WELCOME TO QMS
      </Typography>
      
      <Grid container spacing={3}>
        {modules.map((module: DashboardModule) => {
          const IconComponent = getIconComponent(module.icon);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={module.id}>
              <Link 
                to={module.path} 
                style={{ textDecoration: 'none', height: '100%' }}
                target={module.external ? '_blank' : undefined}
              >
                <DashboardCard>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <IconWrapper>
                      <IconComponent sx={{ fontSize: 'inherit' }} />
                    </IconWrapper>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {module.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: '0.85rem',
                        lineHeight: 1.3
                      }}
                    >
                      {module.description}
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;

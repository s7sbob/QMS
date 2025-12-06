// src/components/DefaultFormsList.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, styled, Chip, Box, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { DashboardModule, FormItem } from '../types/dashboard.types';

const FormCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

interface DefaultFormsListProps {
  module: DashboardModule | undefined;
}

const DefaultFormsList: React.FC<DefaultFormsListProps> = ({ module }) => {
  if (!module) {
    return (
      <PageContainer title="Module Not Found" description="The requested module was not found">
        <Typography variant="h4" color="error">
          Module Not Found
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={module.title} description={module.description}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
          {module.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {module.description}
        </Typography>
        <Chip 
          label={`${module.forms.length} Forms Available`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>
      
      <Grid container spacing={3}>
        {module.forms.map((form: FormItem, index: number) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${form.path}-${index}`}>
            <Link to={form.path} style={{ textDecoration: 'none', height: '100%' }}>
              <FormCard>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3
                }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        lineHeight: 1.2
                      }}
                    >
                      {form.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: '0.875rem',
                        lineHeight: 1.4
                      }}
                    >
                      {form.description}
                    </Typography>
                  </Box>
                </CardContent>
              </FormCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default DefaultFormsList;

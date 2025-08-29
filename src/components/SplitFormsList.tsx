// src/components/SplitFormsList.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, styled, Chip, Box, Theme, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { DashboardModule, FormSection, FormItem } from '../types/dashboard.types';

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

const SectionCard = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const SectionHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

interface SplitFormsListProps {
  module: DashboardModule | undefined;
}

const SplitFormsList: React.FC<SplitFormsListProps> = ({ module }) => {
  if (!module || !module.sections) {
    return (
      <PageContainer title="Module Not Found" description="The requested module was not found">
        <Typography variant="h4" color="error">
          Module Not Found or Invalid Configuration
        </Typography>
      </PageContainer>
    );
  }


  return (
    <PageContainer title={module.title} description={module.description}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
          {module.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {module.description}
        </Typography>
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${totalForms} Total Forms`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`${module.sections.length} Categories`} 
            color="secondary" 
            variant="outlined" 
          />
        </Box> */}
      </Box>

      {/* Split Sections */}
      <Grid container spacing={4}>
        {module.sections.map((section: FormSection, sectionIndex: number) => (
          <Grid item xs={12} lg={6} key={`section-${sectionIndex}`}>
            <SectionCard>
              {/* Section Header */}
              <SectionHeader>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {section.title}
                </Typography>
                {/* <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {section.description}
                </Typography> */}
                <Chip 
                  label={`${section.forms.length} Forms`} 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'inherit'
                  }} 
                />
              </SectionHeader>

              {/* Section Forms */}
              <Grid container spacing={3}>
                {section.forms.map((form: FormItem, formIndex: number) => (
                  <Grid item xs={12} sm={6} md={12} lg={12} key={`form-${sectionIndex}-${formIndex}`}>
                    <Link to={form.path} style={{ textDecoration: 'none', height: '100%' }}>
                      <FormCard>
                        <CardContent sx={{ 
                          textAlign: 'center', 
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 2.5
                        }}>
                          <Box>
                            <Typography 
                              variant="h6" 
                              component="div" 
                              sx={{ 
                                mb: 1.5, 
                                fontWeight: 600,
                                lineHeight: 1.2,
                                fontSize: '1rem'
                              }}
                            >
                              {form.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                opacity: 0.9,
                                fontSize: '0.8rem',
                                lineHeight: 1.3
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
            </SectionCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default SplitFormsList;

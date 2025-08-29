import React from 'react';
import { Grid, Card, CardContent, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

const FormCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
}));

const DeviationCAPAForms = () => {
  const forms = [
    { title: 'Non-Conformity Report', path: '/forms/non-conformity-report' },
    { title: 'Deviation Report', path: '/forms/deviation-report' },
    { title: 'CAPA Report', path: '/forms/capa-report' },
    { title: 'CAPA Effectiveness Check', path: '/forms/capa-effectiveness-check' },
    { title: 'Root Cause Trend Analysis', path: '/forms/root-cause-trend-analysis' },
    { title: 'NCR Logbook', path: '/forms/ncr-logbook' },
    { title: 'CAPA Logbook', path: '/forms/capa-logbook' },
  ];

  return (
    <PageContainer title="Deviation, NCR & CAPA Forms" description="List of forms for Deviation, NCR & CAPA Forms">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Deviation, NCR & CAPA Forms
      </Typography>
      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={form.title}>
            <Link to={form.path} style={{ textDecoration: 'none' }}>
              <FormCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div">
                    {form.title}
                  </Typography>
                </CardContent>
              </FormCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default DeviationCAPAForms;

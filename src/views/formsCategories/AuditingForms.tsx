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

const AuditingForms = () => {
  const forms = [
    { title: 'Internal Audit Checklist (GDP)', path: '/forms/recall-checklist' },
    { title: 'Internal Audit Report', path: '/forms/internal-audit-report' },
    { title: 'Action Plan for CAPA', path: '/forms/action-plan-for-capa' },
    { title: 'Audit Logbook', path: '/forms/audit-logbook' },
    { title: 'Internal Audit Checklist (ISO)', path: '/forms/internal-audit-checklist-iso' },
    { title: 'Internal Audit Checklist (HSE)', path: '/forms/internal-audit-checklist-hse' },
    { title: 'Internal Audit Checklist (GVP)', path: '/forms/internal-audit-checklist-gvp' },
  ];

  return (
    <PageContainer title="Auditing Forms" description="List of forms for Auditing Forms">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Auditing Forms
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

export default AuditingForms;

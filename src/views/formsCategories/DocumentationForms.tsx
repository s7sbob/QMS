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

const DocumentationForms = () => {
  const forms = [
    { title: 'SOP Template', path: '/documentation-control' },
    { title: 'Distribution Form', path: '/documentation-control/distribution_form' },
    { title: 'Change/Cancelation Form', path: '/documentation-control/CancellationForm' },
    { title: 'Documentation Revision Checklist', path: '/documentation-control/Document_Revision_Checklist' },
    { title: 'Request for Extra Copy', path: '/forms/request-for-extra-copy' },
    { title: 'Master Document List', path: '/forms/master-document-list' },
    { title: 'New Documentation Request Form', path: '/documentation-control/Request_Form' },
    { title: 'Approved Signature List', path: '/forms/approved-signature-list' },
  ];

  return (
    <PageContainer title="Documentation Control Forms" description="List of forms for Documentation Control Forms">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Documentation Control Forms
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

export default DocumentationForms;

// src/layouts/full/vertical/header/ActionDropdown.tsx
import React from 'react';
import { Grid, Box, Avatar, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const documentationActions = [
  { id: 'doc1', title: 'New Creation', href: '/pages/List_of_Tasks/New_Creation_SOPs/New_Creation_SOP' },
  { id: 'doc2', title: 'Document Revision Checklist', href: '/Pages/List_of_Tasks/Document_Revision_Checklist/Document_Revision_Checklist' },
  { id: 'doc3', title: 'Cancellation Form', href: '/Pages/List_of_Tasks/Change_Control_and_Cancellation_Form/Change_Request_form' },
  { id: 'doc4', title: 'Distribution Form', href: '/pages/List_of_Tasks/Distribution_form/distribution_form' },
  { id: 'doc5', title: 'Change Control Form', href: '/Pages/List_of_Tasks/Change_Control_and_Cancellation_Form/Change_Request_form' },
  { id: 'doc6', title: 'Issuance of Un-Controlled Documents', href: '/pages/uncontrolled_docs' },
  { id: 'doc7', title: 'Establishment of Job Description', href: '/pages/job_description' },
  { id: 'doc8', title: 'Generating Process Flow Chart', href: 'https://app.diagrams.net' },
];

const ActionDropdown: React.FC = () => {
  return (
    <Grid container spacing={3} mb={4}>
      {documentationActions.map((action) => (
        <Grid item lg={6} key={action.id}>
          <Link to={action.href} className="hover-text-primary" style={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={2}>
              <Box
                minWidth="45px"
                height="45px"
                bgcolor="grey.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {/* يمكنك استبدال Avatar بأي أيقونة مناسبة */}
                <Avatar sx={{ width: 24, height: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="textPrimary"
                  noWrap
                  sx={{ width: '240px' }}
                >
                  {action.title}
                </Typography>
              </Box>
            </Stack>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActionDropdown;

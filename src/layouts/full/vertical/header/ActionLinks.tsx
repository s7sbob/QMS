// src/layouts/full/vertical/header/ActionLinks.tsx
import React from 'react';
import { Avatar, Box, Typography, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  IconFilePlus, 
  IconFilterEdit, 
  IconCircle, 
  IconBoxMultiple, 
  IconFileDiff 
} from '@tabler/icons-react';

const actionLinks = [
  {
    href: '/documentation-control/New_Creation_SOP',
    title: 'New Creation',
    subtext: 'Create a new SOP',
    avatar: <IconFilePlus size={24} />,
  },
  {
    href: '/documentation-control/Document_Revision_Checklist',
    title: 'Document Revision Checklist',
    subtext: 'Review revisions',
    avatar: <IconFilterEdit size={24} />,
  },
  {
    href: '/documentation-control/CancellationForm',
    title: 'Cancellation Form',
    subtext: 'Submit cancellation request',
    avatar: <IconCircle size={24} />,
  },
  {
    href: '/documentation-control/distribution_form',
    title: 'Distribution Form',
    subtext: 'Distribute documents',
    avatar: <IconBoxMultiple size={24} />,
  },
  {
    href: '/Pages/List_of_Tasks/Change_Control_and_Cancellation_Form/Change_Request_form',
    title: 'Change Control Form',
    subtext: 'Submit change request',
    avatar: <IconFileDiff size={24} />,
  },
];

const ActionLinks: React.FC = () => {
  return (
    <Grid container spacing={3} mb={4}>
      {actionLinks.map((link, index) => (
        <Grid item lg={6} key={index}>
          <Link to={link.href} className="hover-text-primary" style={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={2}>
              <Box
                minWidth="45px"
                height="45px"
                bgcolor="grey.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Avatar sx={{ width: 24, height: 24, borderRadius: 0 }}>
                  {link.avatar}
                </Avatar>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="textPrimary"
                  noWrap
                  sx={{ width: '240px' }}
                >
                  {link.title}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  fontSize="12px"
                  noWrap
                  sx={{ width: '240px' }}
                >
                  {link.subtext}
                </Typography>
              </Box>
            </Stack>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActionLinks;

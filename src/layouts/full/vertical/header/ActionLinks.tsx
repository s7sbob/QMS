// src/layouts/full/vertical/header/ActionLinks.tsx
import React from 'react';
import { Avatar, Box, Typography, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  IconFilePlus, 
  IconFilterEdit, 
  IconCircle, 
  IconBoxMultiple, 
  IconChartPpf
} from '@tabler/icons-react';

const actionLinks = [
  {
    href: '/documentation-control/New_Creation_SOP',
    title: 'New Creation SOP',
    subtext: 'Create a new SOP',
    avatar: <IconFilePlus size={24} />,
  },
    {
    href: '/documentation-control/Request_Form',
    title: 'New Document Request Form',
    subtext: 'Create a new SOP',
    avatar: <IconFilePlus size={24} />,
  },
  {
    href: '/documentation-control/distribution_form',
    title: 'Distribution Form',
    subtext: 'Distribute documents',
    avatar: <IconBoxMultiple size={24} />,
  },
  {
    href: '/documentation-control/Document_Revision_Checklist',
    title: 'Document Revision Checklist',
    subtext: 'Review revisions',
    avatar: <IconFilterEdit size={24} />,
  },
  {
    href: '/documentation-control/CancellationForm',
    title: 'Change / Cancellation Form',
    subtext: 'Submit cancellation request',
    avatar: <IconCircle size={24} />,
  },
  {
    // هنا يتم تعديل الرابط ليكون خارجيًا للموقع draw.io
    href: 'https://www.draw.io',
    title: 'Generating a Process Flow Chart',
    subtext: 'Generate process flow chart',
    avatar: <IconChartPpf size={24} />,
  },
];

const ActionLinks: React.FC = () => {
  return (
    <Grid container spacing={3} mb={4}>
      {actionLinks.map((link, index) => {
        // التحقق مما إذا كان الرابط خارجي (يبدأ بـ http)
        const isExternal = link.href.startsWith('http');
        return (
          <Grid item lg={6} key={index}>
            {isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-text-primary"
                style={{ textDecoration: 'none' }}
              >
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
              </a>
            ) : (
              <Link
                to={link.href}
                className="hover-text-primary"
                style={{ textDecoration: 'none' }}
              >
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
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ActionLinks;

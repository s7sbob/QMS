// src/pages/SOPSidebar.tsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Button, Stack } from '@mui/material';
import { IconPlus, IconFileUpload, IconClipboardList, IconExchange, IconShare } from '@tabler/icons-react';

const SOPSidebar: React.FC = () => {
  const actions = [
    { title: 'New Creation', icon: IconPlus, path: '/sops/new-creation' },
    { title: 'Document Revision', icon: IconFileUpload, path: '/sops/revision' },
    { title: 'Change Control', icon: IconExchange, path: '/sops/change-control' },
    { title: 'Distribution', icon: IconShare, path: '/sops/distribution' },
    { title: 'Checklist', icon: IconClipboardList, path: '/sops/checklist' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Documentation Control
      </Typography>
      <Stack spacing={2} mb={3}>
        <Button variant="contained" startIcon={<IconPlus />}>
          Create New SOP
        </Button>
      </Stack>
      <Divider />
      <List>
        {actions.map((action, index) => (
          <ListItem button key={index}>
            <ListItemIcon>
              <action.icon size="20" />
            </ListItemIcon>
            <ListItemText primary={action.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SOPSidebar;

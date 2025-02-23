// src/components/vertical/sidebar/DocumentationSidebar.tsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const tasks = [
  { label: 'New Creation', path: '/pages/List_of_Tasks/New_Creation_SOPs/New_Creation_SOP' },
  { label: 'Document Revision Checklist', path: '/Pages/List_of_Tasks/Document_Revision_Checklist/Document_Revision_Checklist' },
  { label: 'Cancellation Form', path: '/Pages/List_of_Tasks/Change_Control_and_Cancellation_Form/Change_Request_form' },
  { label: 'Distribution Form', path: '/pages/List_of_Tasks/Distribution_form/distribution_form' },
  { label: 'Change Control Form', path: '/Pages/List_of_Tasks/Change_Control_and_Cancellation_Form/Change_Request_form' },
  { label: 'Issuance of Un-Controlled Documents', path: '/pages/uncontrolled_docs' },
  { label: 'Establishment of Job Description', path: '/pages/job_description' },
  { label: 'Generating Process Flow Chart', path: 'https://app.diagrams.net' },
  { label: 'Setting Organization Charts', path: 'https://app.diagrams.net' },
  { label: 'Archiving', path: '/pages/archiving' },
  { label: 'Extra Copy Request', path: '/pages/List_of_Tasks/Extra_Copy_Request/Extra_Copy_Request' },
  { label: 'Approval', path: '/pages/approval' },
  { label: 'Plan Setting', path: '/pages/plan_setting' },
  { label: 'Policy Setting', path: '/pages/policy_setting' },
  { label: 'Validity Control', path: '/pages/validity_control' },
  { label: 'Data Analysis', path: '/pages/data_analysis' },
];

const DocumentationSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // يمكنك تعديل هذا السطر إذا أردت فتح روابط خارجية باستخدام window.open
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100%',
        backgroundColor: '#14213D',
        color: '#FCA311',
        overflowY: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        p: 2,
      }}
    >
      <Typography variant="h6" align="center" mb={2}>
        List of Task
      </Typography>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleNavigate(task.path)}>
              <ListItemText primary={task.label} sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DocumentationSidebar;

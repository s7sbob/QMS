// src/components/apps/users/UserFilter.tsx
import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';

const UserFilter: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Filter Users
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
        <FormControlLabel control={<Checkbox />} label="Inactive" />
      </FormGroup>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" mb={2}>
        Department
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Engineering" />
        <FormControlLabel control={<Checkbox />} label="Support" />
        <FormControlLabel control={<Checkbox />} label="Sales" />
      </FormGroup>
    </Box>
  );
};

export default UserFilter;

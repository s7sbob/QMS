// src/components/apps/users/UserFilter.tsx
import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';

type UserFilterProps = {
  filterActive: boolean;
  setFilterActive: (val: boolean) => void;
  filterInactive: boolean;
  setFilterInactive: (val: boolean) => void;
};

const UserFilter: React.FC<UserFilterProps> = ({
  filterActive,
  setFilterActive,
  filterInactive,
  setFilterInactive,
}) => {
  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterActive(e.target.checked);
  };

  const handleInactiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInactive(e.target.checked);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Filter Users
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={filterActive} onChange={handleActiveChange} />
          }
          label="Active"
        />
        <FormControlLabel
          control={
            <Checkbox checked={filterInactive} onChange={handleInactiveChange} />
          }
          label="Inactive"
        />
      </FormGroup>
      <Divider sx={{ my: 3 }} />

      {/* يمكنك إضافة فلاتر أخرى, مثل Department */}
      {/* <Typography variant="h6" mb={2}>
        Department
      </Typography>
      <FormGroup> ... </FormGroup> */}
    </Box>
  );
};

export default UserFilter;

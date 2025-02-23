// src/pages/SOPFilter.tsx
import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Divider } from '@mui/material';

const SOPFilter: React.FC = () => {
  return (
    <Box p={3}>
      {/* Status Filter */}
      <Typography variant="h6" mb={2}>
        Status
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
        <FormControlLabel control={<Checkbox />} label="Under Review" />
        <FormControlLabel control={<Checkbox />} label="Obsolete" />
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Department Filter */}
      <Typography variant="h6" mb={2}>
        Department
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Quality" />
        <FormControlLabel control={<Checkbox />} label="Operations" />
        <FormControlLabel control={<Checkbox />} label="Production" />
        <FormControlLabel control={<Checkbox />} label="Laboratory" />
        <FormControlLabel control={<Checkbox />} label="Warehouse" />
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Document Type */}
      <Typography variant="h6" mb={2}>
        Document Type
      </Typography>
      <RadioGroup defaultValue="all">
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="sop" control={<Radio />} label="SOP" />
        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
        <FormControlLabel value="form" control={<Radio />} label="Form" />
      </RadioGroup>

      <Divider sx={{ my: 3 }} />

      {/* Version Status */}
      <Typography variant="h6" mb={2}>
        Version Status
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label="Latest Version" />
        <FormControlLabel control={<Checkbox />} label="Previous Versions" />
      </FormGroup>
    </Box>
  );
};

export default SOPFilter;

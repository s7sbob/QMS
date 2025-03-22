import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';

export interface StatusOption {
  id: string;
  name_en: string;
}

export interface DepartmentOption {
  id: string;
  dept_name: string;
}

export interface FilterValues {
  statuses: string[];
  departments: string[];
}

interface SOPFilterProps {
  statusOptions: StatusOption[];
  selectedStatuses: string[];
  onStatusChange: (selected: string[]) => void;
  departmentOptions: DepartmentOption[];
  selectedDepartments: string[];
  onDepartmentChange: (selected: string[]) => void;
}

const SOPFilter: React.FC<SOPFilterProps> = ({
  statusOptions,
  selectedStatuses,
  onStatusChange,
  departmentOptions,
  selectedDepartments,
  onDepartmentChange,
}) => {
  // Toggle a status option
  const handleStatusChange = (id: string) => {
    const currentIndex = selectedStatuses.indexOf(id);
    let newSelected: string[] = [];
    if (currentIndex === -1) {
      newSelected = [...selectedStatuses, id];
    } else {
      newSelected = selectedStatuses.filter((s) => s !== id);
    }
    onStatusChange(newSelected);
  };

  // Toggle a department option
  const handleDepartmentChange = (id: string) => {
    const currentIndex = selectedDepartments.indexOf(id);
    let newSelected: string[] = [];
    if (currentIndex === -1) {
      newSelected = [...selectedDepartments, id];
    } else {
      newSelected = selectedDepartments.filter((d) => d !== id);
    }
    onDepartmentChange(newSelected);
  };

  return (
    <Box p={3}>
      {/* Status Filter */}
      <Typography variant="h6" mb={2}>
        Status
      </Typography>
      <FormGroup>
        {statusOptions.map((option) => (
          <FormControlLabel
            key={option.id}
            control={
              <Checkbox
                checked={selectedStatuses.includes(option.id)}
                onChange={() => handleStatusChange(option.id)}
              />
            }
            label={option.name_en}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Department Filter */}
      <Typography variant="h6" mb={2}>
        Department
      </Typography>
      <FormGroup>
        {departmentOptions.map((dept) => (
          <FormControlLabel
            key={dept.id}
            control={
              <Checkbox
                checked={selectedDepartments.includes(dept.id)}
                onChange={() => handleDepartmentChange(dept.id)}
              />
            }
            label={dept.dept_name}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SOPFilter;

import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SOPCard, { SopHeader } from './SOPCard';
import SOPFilter, { FilterValues, StatusOption, DepartmentOption } from './SOPFilter';
import axiosServices from 'src/utils/axiosServices';

const DocumentationControl: React.FC = () => {
  const [sopHeaders, setSopHeaders] = useState<SopHeader[]>([]);
  const [filteredSOPs, setFilteredSOPs] = useState<SopHeader[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    statuses: [],
    departments: [],
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchSOPHeaders = async () => {
      try {
        const resp = await axiosServices.get('/api/sopheader/getAllSopHeaders');
        const data: SopHeader[] = resp.data || [];
        setSopHeaders(data);
        setFilteredSOPs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSOPHeaders();
  }, []);

  // Apply filtering when filter values or the SOP list changes
  useEffect(() => {
    const filtered = sopHeaders.filter((doc) => {
      const statusMatch =
        filterValues.statuses.length === 0 ||
        filterValues.statuses.includes(doc.Sop_Status.Id);
      const deptMatch =
        filterValues.departments.length === 0 ||
        filterValues.departments.includes(doc.Department_Data.Id);
      return statusMatch && deptMatch;
    });
    setFilteredSOPs(filtered);
  }, [filterValues, sopHeaders]);

  // Extract unique status options and department options from the data
  const statusOptions: StatusOption[] = Array.from(
    new Map(sopHeaders.map((doc) => [doc.Sop_Status.Id, { id: doc.Sop_Status.Id, name_en: doc.Sop_Status.Name_en }])).values()
  );
  const departmentOptions: DepartmentOption[] = Array.from(
    new Map(sopHeaders.map((doc) => [doc.Department_Data.Id, { id: doc.Department_Data.Id, dept_name: doc.Department_Data.Dept_name }])).values()
  );

  return (
    <PageContainer title="Documentation Control" description="SOP Management">
      <Stack direction="row" spacing={2}>
        {/* Filter Section */}
        <Box
          sx={{
            width: 250,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SOPFilter
            statusOptions={statusOptions}
            selectedStatuses={filterValues.statuses}
            onStatusChange={(selected) => setFilterValues((prev) => ({ ...prev, statuses: selected }))}
            departmentOptions={departmentOptions}
            selectedDepartments={filterValues.departments}
            onDepartmentChange={(selected) => setFilterValues((prev) => ({ ...prev, departments: selected }))}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {filteredSOPs.map((sop) => (
              <Grid item xs={12} sm={6} lg={4} key={sop.Id}>
                <SOPCard sop={sop} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default DocumentationControl;

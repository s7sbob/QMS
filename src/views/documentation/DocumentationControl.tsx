/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Pagination, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SOPCard, { SopHeader } from './SOPCard';
import SOPFilter, { FilterValues, StatusOption, DepartmentOption } from './SOPFilter';
import axiosServices from 'src/utils/axiosServices';
import { useLocation } from 'react-router-dom';

const PAGE_SIZE = 9; // Set your default page size

const DocumentationControl: React.FC = () => {
  const [sopHeaders, setSopHeaders] = useState<SopHeader[]>([]);
  const [filteredSOPs, setFilteredSOPs] = useState<SopHeader[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    statuses: [],
    departments: [],
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(PAGE_SIZE); // could make dynamic if needed
  const [total, setTotal] = useState<number>(0);

  const location = useLocation();

  // Fetch paged data from the API every time filters, location, or page change
  useEffect(() => {
    const fetchSOPHeaders = async () => {
      try {
        // Construct query parameters for filters, page, and pageSize
        const params: any = {
          page,
          pageSize,
        };

        const resp = await axiosServices.get('/api/sopheader/getAllSopHeaders', { params });
        // Expecting resp.data = { data, total, page, pageSize }
        setSopHeaders(resp.data.data || []);
        setTotal(resp.data.total || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSOPHeaders();
  }, [location, page, pageSize]); // add filters here if doing backend filtering

  // Apply frontend filtering (if you want client-side filters)
  useEffect(() => {
    const filtered = sopHeaders.filter((doc) => {
      const statusMatch =
        filterValues.statuses.length === 0 || filterValues.statuses.includes(doc.Sop_Status.Id);
      const deptMatch =
        filterValues.departments.length === 0 ||
        filterValues.departments.includes(doc.Department_Data.Id);
      return statusMatch && deptMatch;
    });
    setFilteredSOPs(filtered);
  }, [filterValues, sopHeaders]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / pageSize);

  // Extract unique status and department options
  const statusOptions: StatusOption[] = Array.from(
    new Map(
      sopHeaders.map((doc) => [
        doc.Sop_Status.Id,
        { id: doc.Sop_Status.Id, name_en: doc.Sop_Status.Name_en },
      ]),
    ).values(),
  );
  const departmentOptions: DepartmentOption[] = Array.from(
    new Map(
      sopHeaders.map((doc) => [
        doc.Department_Data.Id,
        { id: doc.Department_Data.Id, dept_name: doc.Department_Data.Dept_name },
      ]),
    ).values(),
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
            onStatusChange={(selected) =>
              setFilterValues((prev) => ({ ...prev, statuses: selected }))
            }
            departmentOptions={departmentOptions}
            selectedDepartments={filterValues.departments}
            onDepartmentChange={(selected) =>
              setFilterValues((prev) => ({ ...prev, departments: selected }))
            }
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
          {/* Paging controls */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
              Page {page} of {totalPages}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default DocumentationControl;

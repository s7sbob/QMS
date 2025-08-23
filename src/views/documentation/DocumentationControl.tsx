/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Pagination, Typography, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SOPCard, { SopHeader } from './SOPCard';
import SOPFilter, { FilterValues, StatusOption, DepartmentOption } from './SOPFilter';
import axiosServices from 'src/utils/axiosServices';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PAGE_SIZE = 9; // Set your default page size

const DocumentationControl: React.FC = () => {
  const [sopHeaders, setSopHeaders] = useState<SopHeader[]>([]);
  const [filteredSOPs, setFilteredSOPs] = useState<SopHeader[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    statuses: [],
    departments: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(PAGE_SIZE); // could make dynamic if needed
  const [total, setTotal] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch paged data from the API every time filters, location, or page change
  useEffect(() => {
    const fetchSOPHeaders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          console.log('No token found, redirecting to login');
          navigate('/auth/login');
          return;
        }

        // Construct query parameters for filters, page, and pageSize
        const params: any = {
          page,
          pageSize,
        };

        console.log('Fetching SOP headers with params:', params);
        console.log('Using token:', token ? 'Token exists' : 'No token');
        
        const resp = await axiosServices.get('/api/sopheader/getAllSopHeaders', { params });
        console.log('API Response:', resp.data);
        
        // Check if response is wrapped in data property or is direct array
        let sopData = [];
        let totalCount = 0;
        
        if (Array.isArray(resp.data)) {
          // Direct array response
          sopData = resp.data;
          totalCount = resp.data.length;
          console.log('Direct array response detected, data length:', sopData.length);
        } else if (resp.data.data && Array.isArray(resp.data.data)) {
          // Wrapped response
          sopData = resp.data.data;
          totalCount = resp.data.total || resp.data.data.length;
          console.log('Wrapped response detected, data length:', sopData.length);
        } else {
          console.error('Unexpected response format:', resp.data);
        }
        
        setSopHeaders(sopData);
        setTotal(totalCount);
        console.log('State updated - sopHeaders:', sopData.length, 'total:', totalCount);
      } catch (error: any) {
        console.error('Error fetching SOP headers:', error);
        
        if (error.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Clear invalid token
          Cookies.remove('token');
          navigate('/auth/login');
        } else if (error.response?.status === 403) {
          setError('Access denied. You do not have permission to view this content.');
        } else {
          setError('Failed to load SOP data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSOPHeaders();
  }, [location, page, pageSize, navigate]); // add filters here if doing backend filtering

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
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {loading ? (
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
                  Loading SOP documents...
                </Typography>
              </Grid>
            ) : error ? (
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center" sx={{ py: 4, color: 'error.main' }}>
                  {error}
                </Typography>
              </Grid>
            ) : filteredSOPs.length > 0 ? (
              filteredSOPs.map((sop) => (
                <Grid item xs={12} sm={6} lg={4} key={sop.Id}>
                  <SOPCard sop={sop} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
                  {sopHeaders.length === 0 ? 'No SOP documents found' : 'No SOPs match the current filters'}
                </Typography>
              </Grid>
            )}
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

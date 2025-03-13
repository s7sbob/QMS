// src/pages/DocumentationControl.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SOPCard from './SOPCard';
import SOPFilter from './SOPFilter';
import axiosServices from 'src/utils/axiosServices';

interface SopHeader {
  Id: string;
  Doc_Title_en: string;
  Doc_Title_ar: string;
  Doc_Code: string;
  Version: number;
  // يمكنك إضافة الحقول الأخرى الموجودة في الـ backend
}

const DocumentationControl: React.FC = () => {
  const [sopHeaders, setSopHeaders] = useState<SopHeader[]>([]);

  useEffect(() => {
    const fetchSOPHeaders = async () => {
      try {
        const resp = await axiosServices.get('/api/sopheader/getAllsop-Header');
        setSopHeaders(resp.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSOPHeaders();
  }, []);

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
          <SOPFilter />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {sopHeaders.map((sop) => (
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

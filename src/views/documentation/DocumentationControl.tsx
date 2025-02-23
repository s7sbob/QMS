// src/pages/DocumentationControl.tsx
import React from 'react';
import { Box, Grid, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import SOPCard from './SOPCard';
import SOPFilter from './SOPFilter';
import sopData from 'src/data/sopData';

const DocumentationControl: React.FC = () => {
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
            {sopData.map((sop) => (
              <Grid item xs={12} sm={6} lg={4} key={sop.id}>
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

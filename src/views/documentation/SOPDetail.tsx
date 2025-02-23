// src/pages/SOPDetail.tsx
import React, { useState } from 'react';
import { Box, Button, Stack, useTheme, IconButton } from '@mui/material';
import { IconMenu2, IconFileChart } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useParams } from 'react-router-dom';

const SOPDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();

  // PDF الافتراضي المعروض
  const [selectedPdf, setSelectedPdf] = useState<string>('/documents/document-control.pdf');

  // دالة للتبديل بين ملف الـ PDF الافتراضي وملف الـ Flow Chart
  const handleTogglePdf = () => {
    if (selectedPdf === '/documents/document-control.pdf') {
      setSelectedPdf('/Flow_Charts/Documentation_Flow_Chart.pdf');
    } else {
      setSelectedPdf('/documents/document-control.pdf');
    }
  };

  return (
    <PageContainer title="SOP Details" description="Standard Operating Procedure Details">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        
        {/* المحتوى الرئيسي */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" spacing={2} mb={3}>
            {/* زر جانبي (مثلاً لفتح/إغلاق سايدبار إن وجد) */}
            <IconButton sx={{ display: { sm: 'none' } }}>
              <IconMenu2 />
            </IconButton>

            {/* زر لتبديل ملف الـ PDF */}
            <Button
              variant="contained"
              startIcon={<IconFileChart />}
              onClick={handleTogglePdf}
            >
              {
                selectedPdf === '/Flow_Charts/Documentation_Flow_Chart.pdf'
                  ? 'Back to Documentation'
                  : 'Documentation Flow Chart'
              }
            </Button>
          </Stack>

          {/* عرض الـ PDF في iframe بنفس طريقة فتحه في المتصفح */}
          <Box
            component="iframe"
            src={`${selectedPdf}#toolbar=1&navpanes=1&scrollbar=1&pagemode=bookmarks&view=0`}
            sx={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              border: 'none',
            }}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default SOPDetail;

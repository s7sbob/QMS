// src/pages/SOPDetail.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, IconButton, Typography } from '@mui/material';
import { IconMenu2, IconFileChart } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import axiosServices from 'src/utils/axiosServices';

// مجرد شكل بيانات الـ SOP Header
interface SopHeaderDetail {
  Id: string;
  Doc_Title_en: string;
  Doc_Title_ar: string;
  Doc_Code: string;
  Version: number;
  // إلخ...
}

const SOPDetail: React.FC = () => {
  const { id } = useParams(); // التقط ID من الRoute
  const [sopHeader, setSopHeader] = useState<SopHeaderDetail | null>(null);

  // PDF المعروض (سواء ملف الدوكومنت أو الـ FlowChart)
  const [selectedPdf, setSelectedPdf] = useState<string>('/documents/document-control.pdf');

  // جلب تفاصيل الـ SOP بالـ ID
  useEffect(() => {
    const fetchSopDetail = async () => {
      if (!id) return;
      try {
        const resp = await axiosServices.get(`/api/sopheader/getByIdsop-Header/${id}`);
        setSopHeader(resp.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSopDetail();
  }, [id]);

  // دالة للتبديل بين ملف الـ PDF الافتراضي وملف الـ Flow Chart
  const handleTogglePdf = () => {
    if (selectedPdf === '/Flow_Charts/Documentation_Flow_Chart.pdf') {
      setSelectedPdf('/documents/document-control.pdf');
    } else {
      setSelectedPdf('/Flow_Charts/Documentation_Flow_Chart.pdf');
    }
  };

  return (
    <PageContainer title="SOP Details" description="Standard Operating Procedure Details">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" spacing={2} mb={3} alignItems="center">
            <IconButton sx={{ display: { sm: 'none' } }}>
              <IconMenu2 />
            </IconButton>

            <Button variant="contained" startIcon={<IconFileChart />} onClick={handleTogglePdf}>
              {selectedPdf === '/Flow_Charts/Documentation_Flow_Chart.pdf'
                ? 'Back to Documentation'
                : 'Documentation Flow Chart'}
            </Button>
          </Stack>

          {/* لو أردت عرض بعض معلومات الـ SOP المسترجعة من السيرفر */}
          {sopHeader && (
            <Box mb={2}>
              <Typography variant="h5">
                {sopHeader.Doc_Title_en} (Version {sopHeader.Version})
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Code: {sopHeader.Doc_Code}
              </Typography>
            </Box>
          )}

          {/* فتح الـ PDF في iframe (كود بسيط لعرض الملف) */}
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

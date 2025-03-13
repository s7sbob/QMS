// src/pages/SOPCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, CardActionArea } from '@mui/material';
import { IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface SopHeader {
  Id: string;
  Doc_Title_en: string;
  Doc_Code: string;
  Version: number;
  Doc_Title_ar?: string;
  // أضف أي حقل آخر موجود في الـ backend
}

interface SOPCardProps {
  sop: SopHeader;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // التوجيه لصفحة التفاصيل حسب الـ ID
    navigate(`/documentation-control/${sop.Id}`);
  };

  return (
    <Card
      sx={{
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'all .2s ease-in-out',
        },
      }}
      onClick={handleClick}
    >
      <CardActionArea>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <IconFileText size="24" />
            {/* يمكنك وضع الحالة (Active / Inactive) أو إصدار النسخة */}
            <Chip label="Active" color="success" size="small" />
          </Stack>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              {sop.Doc_Title_en}
            </Typography>
          </Box>

          {/* مثال لعرض الكود والإصدار */}
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Code: {sop.Doc_Code}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Version: {sop.Version}
            </Typography>
          </Box>

          {/* مثال لتChip الإصدار إن أردت */}
          <Box display="flex" justifyContent="flex-end">
            <Chip label={`Version ${sop.Version}`} size="small" variant="outlined" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SOPCard;

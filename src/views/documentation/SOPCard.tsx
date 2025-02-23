// src/pages/SOPCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, CardActionArea } from '@mui/material';
import { IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PDFPreview from './PDFPreview';
import { SOP } from 'src/data/sopData';

interface SOPCardProps {
  sop: SOP;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/documentation-control/${sop.id}`);
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
          {/* Header with Icon and Status */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <IconFileText size="24" />
            <Chip
              label={sop.status}
              color={sop.status === 'Active' ? 'success' : 'warning'}
              size="small"
            />
          </Stack>

          {/* Title */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              {sop.title}
            </Typography>
          </Box>

          {/* PDF Preview */}
          <Box
            sx={{
              width: '100%',
              height: '200px',
              mb: 2,
              overflow: 'hidden',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <PDFPreview pdfUrl={sop.pdfUrl} width={350} />
          </Box>

          {/* Company and Prepared By */}
          <Stack spacing={1} mb={2}>
            <Typography variant="body2" color="textSecondary">
              Company: {sop.companyName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Prepared by: {sop.preparedBy}
            </Typography>
          </Stack>

          {/* Version */}
          <Box display="flex" justifyContent="flex-end">
            <Chip label={`Version ${sop.version}`} size="small" variant="outlined" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SOPCard;

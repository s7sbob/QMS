import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, CardActionArea } from '@mui/material';
import { IconFileText } from '@tabler/icons-react';
import { useSopNavigation } from 'src/hooks/useSopNavigation';

export interface SopStatus {
  Id: string;
  Name_en: string;
  Name_ar: string;
  Is_Active: number;
}

export interface DepartmentData {
  Id: string;
  Dept_name: string;
  // Additional properties if needed
}

export interface CompData {
  Name: string;
  // Additional properties if needed
}

export interface SopHeader {
  Id: string;
  Doc_Title_en: string;
  Doc_Code: string;
  Version: number;
  Doc_Title_ar?: string;
  Sop_Status: SopStatus;
  Department_Data: DepartmentData;
  Comp_Data: CompData;
  Crt_Date?: string; // Creation date
}

interface SOPCardProps {
  sop: SopHeader;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop }) => {
  const { navigateToSop } = useSopNavigation();

  // Color mapping for statuses (adjust as needed)
  const statusColorMapping: Record<string, "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
    "1": "warning",   // inProgress
    "2": "info",      // Pending
    "3": "error",     // ToBeFixed
    "4": "success",   // Reviewed
    "5": "secondary", // Under Final Audit
    "6": "primary",   // Released
    "8": "info",      // New Request
    "12": "success",  // Approved by Dept Manager
    "13": "error",    // Rejected by Dept Manager
    "14": "error",    // Rejected by QA Manager
    "15": "success",  // Approved by QA Manager
    "16": "success",  // Approved by QA Officer
    "17": "error",    // Rejected by QA Officer
  };

  const handleClick = async () => {
    console.log('SOPCard handleClick - SOP ID:', sop.Id);
    await navigateToSop(sop.Id);
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
          {/* Top row: Icon and status chip */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <IconFileText size="24" />
            <Chip
              label={sop.Sop_Status.Name_en}
              color={statusColorMapping[sop.Sop_Status.Id] || "default"}
              size="small"
            />
          </Stack>

          {/* Creation date displayed at the top center */}
          {sop.Crt_Date && (
            <Box display="flex" justifyContent="center" mb={2}>
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(sop.Crt_Date).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* Document title */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              {sop.Doc_Title_en}
            </Typography>
          </Box>

          {/* Document code */}
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Code: {sop.Doc_Code}
            </Typography>
          </Box>

          {/* Company and Department details */}
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Company: {sop.Comp_Data.Name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Department: {sop.Department_Data.Dept_name}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Chip label={`Version ${sop.Version}`} size="small" variant="outlined" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SOPCard;

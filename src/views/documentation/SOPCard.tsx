import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, CardActionArea } from '@mui/material';
import { IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axiosServices from 'src/utils/axiosServices';

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

// Status names that should open in Request Form instead of SOP Full Document
// These statuses indicate the document is in the request/approval workflow
const REQUEST_FORM_STATUS_NAMES = [
  'request for new creation',
  'request for new creation approved',
  'request for new creation rejected',
  'request for new creation rejected by qa manager',
  'new request',
  'approved',
  'rejected',
  'rejected by qa manager',
];

const SOPCard: React.FC<SOPCardProps> = ({ sop }) => {
  const navigate = useNavigate();

  // Color mapping for statuses (adjust as needed)
  const statusColorMapping: Record<string, "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
    "1": "warning",   // inProgress
    "2": "info",      // Pending
    "3": "error",     // ToBeFixed
    "4": "success",   // Reviewed
    "5": "secondary", // Under Final Audit
    "6": "primary",   // Released
    "8": "info",      // New Request
    "12": "success",  // Approved
    "13": "error",    // Rejected
    "14": "error",    // Rejected by QA Manager
  };

  const handleClick = async () => {
    // Check if status requires opening in Request Form (check by name, case-insensitive)
    const statusName = sop.Sop_Status.Name_en?.toLowerCase() || '';
    const shouldOpenRequestForm = REQUEST_FORM_STATUS_NAMES.some(
      (name) => statusName.includes(name.toLowerCase()) || name.toLowerCase().includes(statusName)
    );

    console.log('SOPCard handleClick:', {
      sopId: sop.Id,
      statusId: sop.Sop_Status.Id,
      statusName: sop.Sop_Status.Name_en,
      statusNameLower: statusName,
      shouldOpenRequestForm,
    });

    if (shouldOpenRequestForm) {
      try {
        // Get the docRequestForm by SOP Header ID
        const response = await axiosServices.get(`/api/docrequest-form/bysopheader/${sop.Id}`);
        if (response.data && response.data.Id) {
          // Navigate to Request Form with the docRequestForm ID
          console.log('Navigating to existing request form:', response.data.Id);
          navigate(`/documentation-control/Request_Form/${response.data.Id}`);
        } else {
          // If no request form found, navigate to Request Form to create new
          console.log('No request form found, navigating to create new request');
          navigate(`/documentation-control/Request_Form?headerId=${sop.Id}`);
        }
      } catch (error: any) {
        console.error('Error fetching doc request form:', error);
        // If 404 (no request form exists), navigate to Request Form to create new
        if (error.response?.status === 404) {
          console.log('404 - No request form exists, navigating to create new request');
          navigate(`/documentation-control/Request_Form?headerId=${sop.Id}`);
        } else {
          // For other errors, fallback to SOP Full Document
          navigate(`/sopFullDocument?headerId=${sop.Id}`);
        }
      }
    } else {
      // Navigate to the details page with the headerId in the query string
      navigate(`/sopFullDocument?headerId=${sop.Id}`);
    }
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

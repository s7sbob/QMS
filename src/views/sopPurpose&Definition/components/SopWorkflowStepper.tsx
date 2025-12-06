// src/views/sopPurpose&Definition/components/SopWorkflowStepper.tsx
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Paper,
  CircularProgress,
} from '@mui/material';
import { StepIconProps } from '@mui/material/StepIcon';
import { useTranslation } from 'react-i18next';
import axiosServices from 'src/utils/axiosServices';
import { SopStatus } from '../types/SopStatus';

// MUI Icons
import EditNoteIcon from '@mui/icons-material/EditNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BuildIcon from '@mui/icons-material/Build';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import WarningIcon from '@mui/icons-material/Warning';

// Colorlib Connector - gradient line between steps
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

// Colorlib Step Icon Root - styled circular icon container
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; isWarning?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active && !ownerState.isWarning,
      style: {
        backgroundImage:
          'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.active && ownerState.isWarning,
      style: {
        backgroundImage:
          'linear-gradient(136deg, rgb(255,167,38) 0%, rgb(255,152,0) 50%, rgb(245,124,0) 100%)',
        boxShadow: '0 4px 10px 0 rgba(255,152,0,.4)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      },
    },
  ],
}));

// Warning statuses (show with orange/amber indicator)
const warningStatuses = ['3', '13', '14', '17'];

// Icon mapping per status ID
const getIconForStatus = (statusId: string): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    '1': <EditNoteIcon />,        // Draft
    '2': <PendingActionsIcon />,  // Pending Review
    '3': <BuildIcon />,           // Needs Fixes
    '4': <FactCheckIcon />,       // Reviewed
    '5': <GavelIcon />,           // Final Approval
    '6': <CheckCircleIcon />,     // Released
    '8': <NoteAddIcon />,         // New Request
    '11': <PendingActionsIcon />, // Pending
    '12': <ThumbUpIcon />,        // Approved by Dept Manager
    '13': <ThumbDownIcon />,      // Rejected by Dept Manager
    '14': <ThumbDownIcon />,      // Rejected by QA Manager
    '15': <ThumbUpIcon />,        // Approved by QA Manager
    '17': <ThumbDownIcon />,      // Rejected by QA Officer
  };
  return iconMap[statusId] || <WarningIcon />;
};

interface SopWorkflowStepperProps {
  currentStatus: string;
  allowedStatuses?: string[];
}

// Default statuses for SOPFullDocument workflow
const defaultSopDocumentStatuses = ['1', '2', '3', '4', '5', '6'];

function ColorlibStepIcon(props: StepIconProps & { statusId: string }) {
  const { active, completed, className, statusId } = props;
  const isWarning = active && warningStatuses.includes(statusId);

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active, isWarning }}
      className={className}
    >
      {getIconForStatus(statusId)}
    </ColorlibStepIconRoot>
  );
}

const SopWorkflowStepper: React.FC<SopWorkflowStepperProps> = ({
  currentStatus,
  allowedStatuses = defaultSopDocumentStatuses,
}) => {
  const { t, i18n } = useTranslation();
  const [statusList, setStatusList] = useState<SopStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all statuses from API
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axiosServices.get('/api/sopStatus/getAll');
        setStatusList(response.data || []);
      } catch (error) {
        console.error('Error fetching SOP statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  // Filter and sort statuses based on allowedStatuses
  const filteredStatuses = statusList
    .filter((status) => allowedStatuses.includes(status.Id))
    .sort((a, b) => {
      // Sort by the order in allowedStatuses array
      return allowedStatuses.indexOf(a.Id) - allowedStatuses.indexOf(b.Id);
    });

  // Determine the active step index based on current status
  const activeStep = filteredStatuses.findIndex(
    (status) => status.Id === currentStatus
  );

  // Get label based on language
  const getStatusLabel = (status: SopStatus): string => {
    if (i18n.language === 'ar' && status.Name_ar) {
      return status.Name_ar;
    }
    return status.Name_en;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (filteredStatuses.length === 0) {
    return null;
  }

  return (
    <Paper className="no-print" sx={{ p: 2, mb: 2 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {filteredStatuses.map((status) => (
          <Step key={status.Id}>
            <StepLabel
              StepIconComponent={(props) => (
                <ColorlibStepIcon {...props} statusId={status.Id} />
              )}
            >
              {getStatusLabel(status)}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default SopWorkflowStepper;

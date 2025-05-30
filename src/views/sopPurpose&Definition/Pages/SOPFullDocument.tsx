/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SOPFullDocument.tsx
import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserContext } from 'src/context/UserContext';
import SOPTemplate from '../components/SOPTemplate';
import PurposeSection from '../components/PurposeSection';
import DefinitionsSection from '../components/DefinitionsSection';
import ScopeSection from '../components/ScopeSection';
import ProceduresSection from '../components/ProceduresSection';
import ResponsibilitiesSection from '../components/ResponsibilitiesSection';
import SafetyConcernsSection from '../components/SafetyConcernsSection';
import { Button, Box, Typography, Chip } from '@mui/material';
import ReferenceDocumentsSection from '../components/ReferenceDocumentsSection';
import AttachmentsSection from '../components/AttachmentsSection';
import CriticalControlPointsSection from '../components/CriticalControlPointsSection';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import A4PageContainer from './A4PageContainer';

// Updated interface to match your actual data structure
export interface SopDetailTracking {
  Id: string;
  Sop_HeaderId: string;
  Sop_PurposeId: string;
  Sop_DefinitionsId: string;
  Sop_ScopeId: string;
  Sop_ResId: string;
  Sop_SafetyConcernsId: string;
  Sop_ProceduresId: string;
  Sop_RefrenceId: string | null;
  Sop_CriticalControlPointId: string | null;
  Is_Active: number;
  crt_date: string;

  // Nested objects that match your response
  Sop_Definitions: any;
  sop_purpose: any;
  Sop_Safety_Concerns: any;
  Sop_Scope: any;
  Sop_Res: any;
  Sop_header: any;
  Sop_Procedures: any;
  Sop_Refrences: any;
  sop_CriticalControlPoints: any;
}

const SOPFullDocument: React.FC = () => {
  const [sopDetail, setSopDetail] = useState<SopDetailTracking | null>(null);
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId');
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const refreshSopDetail = () => {
    const url = headerId
      ? `/api/sopDetailTracking/getSop?headerId=${headerId}`
      : `/api/sopDetailTracking/getSop?isCurrent=true`;
    axiosServices
      .get(url)
      .then((res) => {
        const active = res.data.find((x: SopDetailTracking) => x.Is_Active === 1);
        if (active) setSopDetail(active);
      })
      .catch((err) => console.error('Error refreshing sop detail:', err));
  };

  useEffect(refreshSopDetail, [headerId]);

  // Redirect if status === "9"
  useEffect(() => {
    if (sopDetail?.Sop_header?.status === '9') {
      const dept = sopDetail.Sop_header.Dept_Id;
      const docId = sopDetail.Sop_header.Id;
      navigate(
        `/documentation-control/Document_Revision_Checklist?department=${dept}&documentId=${docId}`,
        { replace: true },
      );
    }
  }, [sopDetail, navigate]);

  useEffect(() => {
    let url = '';
    if (headerId) {
      url = `/api/sopDetailTracking/getSop?headerId=${headerId}`;
    } else {
      url = `/api/sopDetailTracking/getSop?isCurrent=true`;
    }
    axiosServices
      .get(url)
      .then((res) => {
        const activeRecords = res.data.filter((item: SopDetailTracking) => item.Is_Active === 1);
        if (activeRecords.length > 0) {
          setSopDetail(activeRecords[0]);
        }
      })
      .catch((error) => console.error('Error fetching sop detail tracking data:', error));
  }, [headerId]);

  // Document Controls Component
  const DocumentControls: React.FC = () => {
    const handlePrint = () => {
      window.print();
    };

    const handleBack = () => {
      navigate(-1);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case '1':
          return 'default';
        case '2':
          return 'info';
        case '3':
          return 'warning';
        case '4':
          return 'secondary';
        case '5':
          return 'primary';
        case '6':
          return 'success';
        case '9':
          return 'error';
        default:
          return 'default';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case '1':
          return 'Draft';
        case '2':
          return 'Submitted';
        case '3':
          return 'Under Review';
        case '4':
          return 'Supervisor Approved';
        case '5':
          return 'Manager Review';
        case '6':
          return 'Approved';
        case '9':
          return 'Revision Required';
        default:
          return 'Unknown';
      }
    };

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          '@media print': {
            display: 'none',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Document Control
        </Typography>

        {sopDetail?.Sop_header && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Status:</Typography>
            <Chip
              label={getStatusText(sopDetail.Sop_header.status)}
              color={getStatusColor(sopDetail.Sop_header.status)}
              size="small"
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} size="small">
            Print
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            size="small"
          >
            Back
          </Button>
        </Box>
      </Box>
    );
  };

  // Status Control Component
  const StatusControl: React.FC<{
    sopDetail: SopDetailTracking;
    setSopDetail: React.Dispatch<React.SetStateAction<SopDetailTracking | null>>;
  }> = ({ sopDetail }) => {
    const userRole =
      user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

    const updateStatus = (newStatus: string, additionalData: any = {}) => {
      let endpoint = '';
      if (userRole === 'QA Associate') {
        endpoint = `/api/sopheader/updateSopStatusByAssociate/${sopDetail.Sop_header.Id}`;
      } else if (userRole === 'QA Supervisor') {
        endpoint = `/api/sopheader/updateSopStatusByReviewer/${sopDetail.Sop_header.Id}`;
      } else if (userRole === 'QA Manager') {
        endpoint = `/api/sopheader/updateSopStatusByManager/${sopDetail.Sop_header.Id}`;
      }
      const payload = {
        status: { newStatus },
        ...additionalData,
      };
      axiosServices
        .patch(endpoint, payload)
        .then(() => {
          refreshSopDetail();
        })
        .catch((err) => console.error('Error updating status', err));
    };

    useEffect(() => {
      if (userRole === 'QA Supervisor' && sopDetail.Sop_header?.status === '2') {
        updateStatus('3');
      }
    }, [userRole, sopDetail.Sop_header?.status]);

    useEffect(() => {
      if (userRole === 'QA Manager' && sopDetail.Sop_header?.status === '4') {
        updateStatus('5');
      }
    }, [userRole, sopDetail.Sop_header?.status]);

    if (userRole === 'QA Associate' && sopDetail.Sop_header?.status === '1') {
      return (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() =>
              updateStatus('2', {
                signedBy: user?.signUrl,
                issuedDate: new Date().toISOString(),
              })
            }
          >
            Save and Submit (تحديث الحالة إلى 2)
          </Button>
        </Box>
      );
    }

    if (userRole === 'QA Supervisor') {
      if (sopDetail.Sop_header?.status === '3') {
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() =>
                updateStatus('4', {
                  signedBy: user?.signUrl,
                  revisionDate: new Date().toISOString(),
                })
              }
            >
              Approve as Supervisor (تحديث الحالة إلى 4)
            </Button>
          </Box>
        );
      }
      if (sopDetail.Sop_header?.status === '4') {
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={() => updateStatus('5')}>
              Confirm Approval (تحديث الحالة إلى 5)
            </Button>
          </Box>
        );
      }
    }

    if (userRole === 'QA Manager' && sopDetail.Sop_header?.status === '5') {
      return (
        <Box
          sx={{
            mt: 2,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              updateStatus('6', {
                signedBy: user?.signUrl,
                effectiveDate: new Date().toISOString(),
              })
            }
          >
            Approve as Manager (تحديث الحالة إلى 6)
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              updateStatus('3', { signedBy: user?.signUrl, action: 'reject' });
              navigate('/documentation-control');
            }}
          >
            Return For Revision (إرجاع الحالة إلى 4)
          </Button>
        </Box>
      );
    }
    return null;
  };

  if (!sopDetail) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Typography>Loading SOP document...</Typography>
      </Box>
    );
  }

  return (
    <>
      <SOPTemplate headerData={sopDetail?.Sop_header || null}>
        <A4PageContainer>
          <div className="sop-section">
            <PurposeSection initialData={sopDetail?.sop_purpose || null} />
          </div>

          <div className="sop-section">
            <DefinitionsSection initialData={sopDetail?.Sop_Definitions || null} />
          </div>

          <div className="sop-section">
            <ScopeSection initialData={sopDetail?.Sop_Scope || null} />
          </div>

          <div className="sop-section">
            <ResponsibilitiesSection initialData={sopDetail?.Sop_Res || null} />
          </div>

          <div className="sop-section">
            <SafetyConcernsSection initialData={sopDetail?.Sop_Safety_Concerns || null} />
          </div>

          <div className="sop-section">
            <ProceduresSection initialData={sopDetail?.Sop_Procedures || null} />
          </div>

          <div className="sop-section">
            <CriticalControlPointsSection
              initialData={sopDetail?.sop_CriticalControlPoints || null}
            />
          </div>

          {headerId && (
            <div className="sop-section">
              <AttachmentsSection headerId={headerId} />
            </div>
          )}

          <div className="sop-section">
            <ReferenceDocumentsSection initialData={sopDetail?.Sop_Refrences || null} />
          </div>
        </A4PageContainer>
      </SOPTemplate>

      <DocumentControls />
      {sopDetail && <StatusControl sopDetail={sopDetail} setSopDetail={setSopDetail} />}
    </>
  );
};

export default SOPFullDocument;

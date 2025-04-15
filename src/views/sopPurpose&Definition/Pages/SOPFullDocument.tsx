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
import { Button, Box } from '@mui/material';

export interface SopDetailTracking {
  Id: string;
  Sop_HeaderId: string;
  sop_purpose: any;
  Sop_Definitions: any;
  Sop_Scope: any;
  Sop_Procedures: any;
  Sop_Res: any;
  Sop_Safety_Concerns?: any;
  Is_Active: number;
  crt_date: string;
  Sop_header: any;
  status: string;
}

const SOPFullDocument: React.FC = () => {
  const [sopDetail, setSopDetail] = useState<SopDetailTracking | null>(null);
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId');
  const user = useContext(UserContext);

  const refreshSopDetail = () => {
    let url = '';
    if (headerId) {
      url = `/api/sopDetailTracking/getSop?headerId=${headerId}`;
    } else {
      url = `/api/sopDetailTracking/getSop?isCurrent=true`;
    }
    axiosServices
      .get(url)
      .then((res) => {
        const activeRecords = res.data.filter(
          (item: SopDetailTracking) => item.Is_Active === 1
        );
        if (activeRecords.length > 0) {
          setSopDetail(activeRecords[0]);
        }
      })
      .catch((error) =>
        console.error('Error refreshing sop detail tracking data:', error)
      );
  };

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
        const activeRecords = res.data.filter(
          (item: SopDetailTracking) => item.Is_Active === 1
        );
        if (activeRecords.length > 0) {
          setSopDetail(activeRecords[0]);
        }
      })
      .catch((error) =>
        console.error('Error fetching sop detail tracking data:', error)
      );
  }, [headerId]);

  // مكون التحكم بالحالة (StatusControl)
  const StatusControl: React.FC<{
    sopDetail: SopDetailTracking;
    setSopDetail: React.Dispatch<React.SetStateAction<SopDetailTracking | null>>;
  }> = ({ sopDetail }) => {
    const navigate = useNavigate();
    const userRole =
      user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles
        ?.Name || '';

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

    // تلقائيًا تحديث الحالة للـ QA Supervisor والـ QA Manager حسب الحالة الحالية
    useEffect(() => {
      if (userRole === 'QA Supervisor' && sopDetail.Sop_header.status === '2') {
        updateStatus('3');
      }
    }, [userRole, sopDetail.Sop_header.status]);

    useEffect(() => {
      if (userRole === 'QA Manager' && sopDetail.Sop_header.status === '4') {
        updateStatus('5');
      }
    }, [userRole, sopDetail.Sop_header.status]);

    if (userRole === 'QA Associate' && sopDetail.Sop_header.status === '1') {
      return (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => updateStatus('2', { signedBy: user?.signUrl })}
          >
            Save and Submit (تحديث الحالة إلى 2)
          </Button>
        </Box>
      );
    }
    if (userRole === 'QA Supervisor') {
      if (sopDetail.Sop_header.status === '3') {
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => updateStatus('4', { signedBy: user?.signUrl })}
            >
              Approve as Supervisor (تحديث الحالة إلى 4)
            </Button>
          </Box>
        );
      }
      if (sopDetail.Sop_header.status === '4') {
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => updateStatus('5')}
            >
              Confirm Approval (تحديث الحالة إلى 5)
            </Button>
          </Box>
        );
      }
    }
    if (userRole === 'QA Manager' && sopDetail.Sop_header.status === '5') {
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
            onClick={() => updateStatus('6', { signedBy: user?.signUrl })}
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

  return (
    <>
      <SOPTemplate headerData={sopDetail ? sopDetail.Sop_header : null}>
        <PurposeSection initialData={sopDetail ? sopDetail.sop_purpose : null} />
        <DefinitionsSection initialData={sopDetail ? sopDetail.Sop_Definitions : null} />
        <ScopeSection initialData={sopDetail ? sopDetail.Sop_Scope : null} />
        <ResponsibilitiesSection initialData={sopDetail ? sopDetail.Sop_Res : null} />
        <SafetyConcernsSection initialData={sopDetail ? sopDetail.Sop_Safety_Concerns : null} />
        <ProceduresSection initialData={sopDetail ? sopDetail.Sop_Procedures : null} />
      </SOPTemplate>
      {sopDetail && <StatusControl sopDetail={sopDetail} setSopDetail={setSopDetail} />}
    </>
  );
};

export default SOPFullDocument;

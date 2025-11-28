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
import { Button, Box } from '@mui/material';
import ReferenceDocumentsSection from '../components/ReferenceDocumentsSection';
import AttachmentsSection from '../components/AttachmentsSection';
import CriticalControlPointsSection from '../components/CriticalControlPointsSection';
import Spinner from 'src/views/spinner/Spinner';

export interface SopDetailTracking {
  Id: string;
  Sop_HeaderId: string;
  sop_purpose: any;
  Sop_Definitions: any;
  Sop_Scope: any;
  Sop_Procedures: any;
  Sop_Res: any;
  Sop_Safety_Concerns?: any;
  Sop_References?: any;
  Sop_Critical_Control_Points?: any; // ← NEW
  Sop_Refrence?: any;
  Is_Active: number;
  crt_date: string;
  Sop_header: any;
  status: string;
}

const SOPFullDocument: React.FC = () => {
  const [sopDetail, setSopDetail] = useState<SopDetailTracking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing sop detail:', err);
        setIsLoading(false);
      });
  };

  useEffect(refreshSopDetail, [headerId]);

  // Redirect if status === "9"
  useEffect(() => {
    if (sopDetail?.Sop_header.status === '9') {
      const dept = sopDetail.Sop_header.Dept_Id;
      const docId = sopDetail.Sop_header.Id;
      navigate(
        `/documentation-control/Document_Revision_Checklist?department=${dept}&documentId=${docId}`,
        { replace: true },
      );
    }
  }, [sopDetail, navigate]);

  // مكون التحكم بالحالة (StatusControl)
  const StatusControl: React.FC<{
    sopDetail: SopDetailTracking;
    setSopDetail: React.Dispatch<React.SetStateAction<SopDetailTracking | null>>;
  }> = ({ sopDetail }) => {
    const navigate = useNavigate();
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
      if (sopDetail.Sop_header.status === '3') {
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
      if (sopDetail.Sop_header.status === '4') {
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={() => updateStatus('5')}>
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

  if (isLoading) {
    return <Spinner text="Loading SOP data" />;
  }

  return (
    <>
      <SOPTemplate headerData={sopDetail?.Sop_header || null}>
        <PurposeSection initialData={sopDetail?.sop_purpose || null} />
        {/* ⭐ NEW – قسم Definitions */}
        <DefinitionsSection initialData={sopDetail?.Sop_Definitions || null} />
        {/* ⭐ NEW – قسم Scope */}
        <ScopeSection initialData={sopDetail?.Sop_Scope || null} />
        {/* ⭐ NEW – قسم Responsibilities */}
        <ResponsibilitiesSection initialData={sopDetail?.Sop_Res || null} />
        {/* ⭐ NEW – قسم Safety Concerns */}
        <SafetyConcernsSection initialData={sopDetail?.Sop_Safety_Concerns || null} />
        {/* ⭐ NEW – قسم Procedures */}
        <ProceduresSection initialData={sopDetail?.Sop_Procedures || null} />
        {/* ⭐ NEW – قسم Critical Control Points */}
        {/* ⭐ NEW – Critical Control Points */}
        <CriticalControlPointsSection
          initialData={sopDetail?.Sop_Critical_Control_Points || null}
        />

        {/* ⭐ NEW – قسم Attachments */}
        {headerId && <AttachmentsSection headerId={headerId} />}
        {/* ⭐ NEW – قسم References */}
        <ReferenceDocumentsSection initialData={(sopDetail?.Sop_Refrence as any) || null} />
      </SOPTemplate>

      {sopDetail && <StatusControl sopDetail={sopDetail} setSopDetail={setSopDetail} />}
    </>
  );
};
export default SOPFullDocument;

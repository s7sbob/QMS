/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SOPFullDocument.tsx
import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from 'src/context/UserContext';
import SOPTemplate from '../components/SOPTemplate';
import PurposeSection from '../components/PurposeSection';
import DefinitionsSection from '../components/DefinitionsSection';
import ScopeSection from '../components/ScopeSection';
import ProceduresSection from '../components/ProceduresSection';
import ResponsibilitiesSection from '../components/ResponsibilitiesSection';
import SafetyConcernsSection from '../components/SafetyConcernsSection';
import { Button, Box, Stack, Paper, Tooltip } from '@mui/material';
import { IconFileText } from '@tabler/icons-react';
import Swal from 'sweetalert2';
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
  Sop_Refrences?: any; // API returns Sop_Refrences (with 's')
  sop_CriticalControlPoints?: any; // API returns sop_CriticalControlPoints (lowercase 's', no underscores)
  Is_Active: number;
  crt_date: string;
  Sop_header: any;
  status: string;
}

const SOPFullDocument: React.FC = () => {
  const { t } = useTranslation();
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

    // Send notification to Creator and QA Manager
    const sendNotificationToCreatorAndManager = async (headerId: string, newStatus: string) => {
      try {
        // Get Creator (Prepared_By) from header data
        const creatorId = sopDetail.Sop_header.Prepared_By;

        // Get QA Managers
        const managersResponse = await axiosServices.get('/api/users/getUsersByRole/QA Manager');
        const qaManagers = managersResponse.data || [];

        const statusMessages: { [key: string]: string } = {
          '3': 'تم إرجاع المستند للتعديل. يرجى مراجعة الملاحظات وإجراء التعديلات اللازمة.',
          '4': 'تمت مراجعة المستند بنجاح وهو الآن في انتظار الموافقة النهائية.',
        };

        const message = statusMessages[newStatus] || `تم تحديث حالة المستند إلى ${newStatus}`;

        // Send to Creator
        if (creatorId) {
          await axiosServices.post('/api/notification/pushNotification', {
            targetUserId: creatorId,
            message: message,
            data: { headerId, newStatus, type: 'status_update' }
          });
        }

        // Send to QA Managers
        for (const manager of qaManagers) {
          await axiosServices.post('/api/notification/pushNotification', {
            targetUserId: manager.Id,
            message: message,
            data: { headerId, newStatus, type: 'status_update' }
          });
        }
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    };

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

    // تلقائيًا تحديث الحالة للـ QA Manager حسب الحالة الحالية
    useEffect(() => {
      if (userRole === 'QA Manager' && sopDetail.Sop_header.status === '4') {
        updateStatus('5');
      }
    }, [userRole, sopDetail.Sop_header.status]);

    if (userRole === 'QA Associate' && sopDetail.Sop_header.status === '1') {
      return (
        <Box className="no-print" sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() =>
              updateStatus('2', {
                signedBy: user?.signUrl,
                issuedDate: new Date().toISOString(),
              })
            }
          >
            {t('buttons.saveAndSubmit')}
          </Button>
        </Box>
      );
    }
    if (userRole === 'QA Supervisor') {
      // When status is 2, show three buttons for QA Supervisor
      if (sopDetail.Sop_header.status === '2') {
        const handleToBeFixed = async () => {
          try {
            await axiosServices.patch(
              `/api/sopheader/updateSopStatusByReviewer/${sopDetail.Sop_header.Id}`,
              {
                status: { newStatus: '3' },
              }
            );
            // Send notifications to Creator and QA Manager
            await sendNotificationToCreatorAndManager(sopDetail.Sop_header.Id, '3');
            Swal.fire({
              icon: 'info',
              title: t('messages.sentForFixing') as string,
              text: t('messages.documentSentForFixing') as string,
            }).then(() => {
              navigate('/documentation-control');
            });
          } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
              icon: 'error',
              title: t('messages.error') as string,
              text: t('messages.failedUpdateStatus') as string,
            });
          }
        };

        const handleSubmitReview = async () => {
          try {
            await axiosServices.patch(
              `/api/sopheader/updateSopStatusByReviewer/${sopDetail.Sop_header.Id}`,
              {
                status: { newStatus: '4' },
                reviewed_by: user?.Id,
                reviewed_by_sign: user?.signUrl,
                reviewed_date: new Date().toISOString(),
                signedBy: user?.signUrl,
                revisionDate: new Date().toISOString(),
              }
            );
            // Send notifications to Creator and QA Manager
            await sendNotificationToCreatorAndManager(sopDetail.Sop_header.Id, '4');
            Swal.fire({
              icon: 'success',
              title: t('messages.reviewCompleted') as string,
              text: t('messages.documentReviewedSuccess') as string,
            }).then(() => {
              navigate('/documentation-control');
            });
          } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
              icon: 'error',
              title: t('messages.error') as string,
              text: t('messages.failedUpdateStatus') as string,
            });
          }
        };

        const handleCancel = () => {
          navigate('/documentation-control');
        };

        return (
          <Paper className="no-print" sx={{ mt: 4, p: 3, mx: 'auto', maxWidth: 900 }}>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button
                variant="contained"
                color="warning"
                size="large"
                onClick={handleToBeFixed}
                sx={{ minWidth: 200 }}
              >
                {t('buttons.toBeFixed')}
              </Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmitReview}
                sx={{ minWidth: 200 }}
              >
                {t('buttons.submitForReview')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={handleCancel}
                sx={{ minWidth: 200 }}
              >
                {t('buttons.cancel')}
              </Button>
            </Stack>
          </Paper>
        );
      }

      if (sopDetail.Sop_header.status === '3') {
        const handleSubmit = async () => {
          try {
            // Update SOP header with QA Supervisor data and status 4
            await axiosServices.patch(
              `/api/sopheader/updateSopStatusByReviewer/${sopDetail.Sop_header.Id}`,
              {
                status: { newStatus: '4' },
                reviewed_by: user?.Id,
                reviewed_by_sign: user?.signUrl,
                reviewed_date: new Date().toISOString(),
                signedBy: user?.signUrl,
                revisionDate: new Date().toISOString(),
              }
            );

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Document reviewed and approved successfully',
            }).then(() => {
              navigate('/documentation-control');
            });
          } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update document status',
            });
          }
        };

        const handleCancel = () => {
          navigate('/documentation-control');
        };

        return (
          <Paper className="no-print" sx={{ mt: 4, p: 3, mx: 'auto', maxWidth: 600 }}>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmit}
                sx={{ minWidth: 200 }}
              >
                {t('buttons.submitReview')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={handleCancel}
                sx={{ minWidth: 200 }}
              >
                {t('buttons.cancel')}
              </Button>
            </Stack>
          </Paper>
        );
      }
    }
    if (userRole === 'QA Manager' && sopDetail.Sop_header.status === '5') {
      const handleSubmit = async () => {
        try {
          const approvalDate = new Date().toISOString();
          // Update SOP header with QA Manager data, status 6, and issue date
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByManager/${sopDetail.Sop_header.Id}`,
            {
              status: { newStatus: '6' },
              Approved_by: user?.Id,
              approved_by_sign: user?.signUrl,
              approved_date: approvalDate,
              issuedDate: approvalDate, // Issue date is the same as approval date
              signedBy: user?.signUrl,
              effectiveDate: approvalDate,
            }
          );

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Document approved and issued successfully',
          }).then(() => {
            navigate('/documentation-control');
          });
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to approve document',
          });
        }
      };

      const handleCancel = () => {
        navigate('/documentation-control');
      };

      const handleReject = async () => {
        try {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByManager/${sopDetail.Sop_header.Id}`,
            {
              status: { newStatus: '3' },
              signedBy: user?.signUrl,
              action: 'reject',
            }
          );
          navigate('/documentation-control');
        } catch (error) {
          console.error('Error rejecting document:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to return document for revision',
          });
        }
      };

      return (
        <Paper className="no-print" sx={{ mt: 4, p: 3, mx: 'auto', maxWidth: 800 }}>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
              sx={{ minWidth: 200 }}
            >
              {t('buttons.approveAndIssue')}
            </Button>
            <Button
              variant="contained"
              color="warning"
              size="large"
              onClick={handleReject}
              sx={{ minWidth: 200 }}
            >
              {t('buttons.returnForRevision')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={handleCancel}
              sx={{ minWidth: 200 }}
            >
              {t('buttons.cancel')}
            </Button>
          </Stack>
        </Paper>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Spinner text="Loading SOP data" />;
  }

  // Check if document is read-only (status >= 4)
  const isReadOnly = parseInt(sopDetail?.Sop_header?.status || '0', 10) >= 4;

  return (
    <>
      {/* Open in ONLYOFFICE Button - Opens in temp/draft mode */}
      {headerId && (
        <Box className="no-print" sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={t('buttons.openInOnlyOffice') || 'Open in ONLYOFFICE Editor'}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconFileText />}
              onClick={() => navigate(`/SopFullDocument2/${headerId}?mode=temp`)}
            >
              {t('buttons.openInOnlyOffice') || 'Open in ONLYOFFICE'}
            </Button>
          </Tooltip>
        </Box>
      )}

      <SOPTemplate headerData={sopDetail?.Sop_header || null}>
        <PurposeSection initialData={sopDetail?.sop_purpose || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – قسم Definitions */}
        <DefinitionsSection initialData={sopDetail?.Sop_Definitions || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – قسم Scope */}
        <ScopeSection initialData={sopDetail?.Sop_Scope || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – قسم Responsibilities */}
        <ResponsibilitiesSection initialData={sopDetail?.Sop_Res || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – قسم Safety Concerns */}
        <SafetyConcernsSection initialData={sopDetail?.Sop_Safety_Concerns || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – قسم Procedures */}
        <ProceduresSection initialData={sopDetail?.Sop_Procedures || null} isReadOnly={isReadOnly} />
        {/* ⭐ NEW – Critical Control Points */}
        <CriticalControlPointsSection
          initialData={sopDetail?.sop_CriticalControlPoints || null}
          isReadOnly={isReadOnly}
        />

        {/* ⭐ NEW – قسم References */}
        <ReferenceDocumentsSection initialData={sopDetail?.Sop_Refrences || null} isReadOnly={isReadOnly} />

        {/* ⭐ NEW – قسم Attachments */}
        {headerId && <AttachmentsSection headerId={headerId} />}
      </SOPTemplate>

      {sopDetail && <StatusControl sopDetail={sopDetail} setSopDetail={setSopDetail} />}
    </>
  );
};
export default SOPFullDocument;

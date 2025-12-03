/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProceduresSection.tsx
import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import EditDialog from './EditDialog';
import { UserContext } from 'src/context/UserContext';

export interface Procedure {
  Id: string;
  Content_en: string;
  Content_ar: string;
  Version: number | null;
  Is_Current: number;
  Crt_Date: string;
  Crt_by: string | null;
  Modified_Date: string | null;
  Modified_by: string | null;
  Sop_HeaderId: string;
  Is_Active: number;
  modificationLog?: { date: string; change: string }[];
  reviewer_Comment?: string | null;
}

interface ProceduresSectionProps {
  initialData: Procedure | null;
  isReadOnly?: boolean;
}

const ProceduresSection: React.FC<ProceduresSectionProps> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Procedure[]>([]);

  useEffect(() => {
    if (initialData) {
      setProcedure(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!procedure || isReadOnly) return;
    axiosServices
      .get(`/api/sopprocedures/getAllHistory/${procedure.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error('Error fetching historical procedures:', error));
  };

  // Send notification to QA Associates when a comment is added
  const sendNotificationToQAAssociates = async (headerId: string, sectionName: string) => {
    try {
      const response = await axiosServices.get(`/api/user/getUsersByRole/QA Associate`);
      const qaAssociates = response.data || [];
      for (const qaUser of qaAssociates) {
        await axiosServices.post('/api/notification/pushNotification', {
          targetUserId: qaUser.Id,
          message: `A reviewer has added a comment on the "${sectionName}" section. Please review and update.`,
          data: { headerId, sectionName, type: 'reviewer_comment' }
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const handleDialogSave = async (
    newContentEn: string,
    newContentAr: string,
    newReviewerComment: string,
  ) => {
    if (!procedure) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== procedure.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== procedure.Content_en || newContentAr !== procedure.Content_ar) {
        res = await axiosServices.post('/api/soprocedures/addSop-Procedure', {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: procedure.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/soprocedures/updateSop-Procedure/${procedure.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setProcedure(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(procedure.Sop_HeaderId, 'Procedures');

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${procedure.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (error) {
      console.error('Error saving procedure:', error);
    }
  };

  return (
    <Box sx={{ mt: 0 }}>
      <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
        <Table sx={{ tableLayout: 'fixed', backgroundColor: '#fff' }}>
          <TableBody>
            {/* Section Title Row - Gray Background */}
            <TableRow
              onDoubleClick={handleDoubleClick}
              sx={{
                cursor: isReadOnly ? 'default' : 'pointer',
                '&:hover': { '& td': { backgroundColor: isReadOnly ? '#fff' : '#f5f5f5' } },
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  width: '50%',
                  borderRight: '2px solid #000',
                  borderBottom: 'none',
                  backgroundColor: '#fff',
                  color: procedure && procedure.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                6. Procedures:
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  width: '50%',
                  direction: 'rtl',
                  borderBottom: 'none',
                  backgroundColor: '#fff',
                  color: procedure && procedure.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                ٦- الإجراءات:
              </TableCell>
            </TableRow>
            {/* Content Row */}
            {procedure && (
              <TableRow>
                <TableCell
                  sx={{
                    borderRight: '2px solid #000',
                    verticalAlign: 'top',
                    backgroundColor: '#fff',
                    padding: '12px',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: procedure.Content_en }} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    direction: 'rtl',
                    verticalAlign: 'top',
                    backgroundColor: '#fff',
                    padding: '12px',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: procedure.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {procedure && (
        <EditDialog
          open={openDialog}
          title="تفاصيل الإجراءات"
          initialContentEn={procedure.Content_en}
          initialContentAr={procedure.Content_ar}
          initialReviewerComment={procedure.reviewer_Comment || ''}
          additionalInfo={{
            version: procedure.Version,
            crtDate: procedure.Crt_Date,
            modifiedDate: procedure.Modified_Date,
            crtBy: procedure.Crt_by,
            modifiedBy: procedure.Modified_by,
          }}
          historyData={historyData}
          userRole={userRole}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default ProceduresSection;

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ResponsibilitiesSection.tsx
import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import EditDialog from './EditDialog';
import { UserContext } from 'src/context/UserContext';

export interface Responsibility {
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

interface ResponsibilitiesSectionProps {
  initialData: Responsibility | null;
}

const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({ initialData }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [responsibility, setResponsibility] = useState<Responsibility | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Responsibility[]>([]);

  useEffect(() => {
    if (initialData) {
      setResponsibility(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!responsibility) return;
    axiosServices
      .get(`/api/sopRes/getAllHistory/${responsibility.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error('Error fetching historical responsibilities:', error));
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
    if (!responsibility) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== responsibility.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== responsibility.Content_en || newContentAr !== responsibility.Content_ar) {
        res = await axiosServices.post('/api/sopRes/SopReponsibility-create', {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: responsibility.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/sopRes/updateSop-Res/${responsibility.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setResponsibility(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(responsibility.Sop_HeaderId, 'Responsibilities');
      }
    } catch (error) {
      console.error('Error saving responsibility:', error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: responsibility && responsibility.reviewer_Comment ? 'red' : 'inherit', // الشرط هنا لتلوين العنوان بالاحمر عند وجود تعليق
        }}
      >
        <span>4. Responsibilities:</span>
        <span dir="rtl">4. المسؤوليات</span>
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>English Content</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '50%' }} align="right">
                المحتوى العربي
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responsibility && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: responsibility.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: 'rtl' }}>
                  <div dangerouslySetInnerHTML={{ __html: responsibility.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {responsibility && (
        <EditDialog
          open={openDialog}
          title="تفاصيل المسؤوليات"
          initialContentEn={responsibility.Content_en}
          initialContentAr={responsibility.Content_ar}
          initialReviewerComment={responsibility.reviewer_Comment || ''}
          additionalInfo={{
            version: responsibility.Version,
            crtDate: responsibility.Crt_Date,
            modifiedDate: responsibility.Modified_Date,
            crtBy: responsibility.Crt_by,
            modifiedBy: responsibility.Modified_by,
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

export default ResponsibilitiesSection;

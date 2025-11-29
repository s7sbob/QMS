import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import EditDialog from './EditDialog';
import { UserContext } from 'src/context/UserContext';

export interface ReferenceDoc {
  Id: string;
  Content_en: string;
  Content_ar: string;
  Version: number | null;
  Is_Current: number;
  Crt_Date: string;
  Modified_Date: string | null;
  Crt_by: string | null;
  Modified_by: string | null;
  Sop_HeaderId: string;
  Is_Active: number;
  reviewer_Comment?: string | null;
}

const ReferenceDocumentsSection: React.FC<{ initialData: ReferenceDoc | null }> = ({
  initialData,
}) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [refDoc, setRefDoc] = useState<ReferenceDoc | null>(null);
  const [openDlg, setOpenDlg] = useState(false);
  const [history, setHistory] = useState<ReferenceDoc[]>([]);

  /*  ❱❱❱  اربط البيانات الواردة من الـ parent  */
  useEffect(() => {
    if (initialData) setRefDoc(initialData);
  }, [initialData]);

  /*  ❱❱❱  جلب السجلّ التاريخي عند ضغط مزدوج  */
  const handleDoubleClick = () => {
    if (!refDoc) return;
    axiosServices
      .get(`/api/sopRefrences/history/${refDoc.Sop_HeaderId}`)
      .then((r) => {
        const inactive = r.data.filter((x: any) => x.Is_Active === 0);
        setHistory(inactive);
        setOpenDlg(true);
      })
      .catch((err) => console.error(err));
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

  /*  ❱❱❱  حفظ التعديلات أو إنشاء إصدار جديد  */
  const onSave = async (en: string, ar: string, comment: string) => {
    if (!refDoc) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = comment && comment !== refDoc.reviewer_Comment;

    const payload = {
      Content_en: en,
      Content_ar: ar,
      reviewer_Comment: comment,
      Sop_HeaderId: refDoc.Sop_HeaderId,
    };

    const isNew = en !== refDoc.Content_en || ar !== refDoc.Content_ar;

    try {
      /*  ⬇︎  المسارات الجديدة في الـ backend  */
      const res = isNew
        ? await axiosServices.post('/api/sopRefrences/Create', payload)
        : await axiosServices.put(`/api/sopRefrences/update/${refDoc.Id}`, payload);

      setRefDoc(res.data);
      setOpenDlg(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(refDoc.Sop_HeaderId, 'Reference Documents');
      }
    } catch (err) {
      console.error(err);
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
          color: refDoc?.reviewer_Comment ? 'red' : 'inherit',
        }}
      >
        <span>8. Reference Documents:</span>
        <span dir="rtl">8. الوثائق المرجعية</span>
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>
                English Content
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', width: '50%' }}
                align="right"
              >
                المحتوى العربي
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refDoc && (
              <TableRow
                onDoubleClick={handleDoubleClick}
                hover
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: refDoc.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: 'rtl' }}>
                  <div dangerouslySetInnerHTML={{ __html: refDoc.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {refDoc && (
        <EditDialog
          open={openDlg}
          title="تفاصيل الوثائق المرجعية"
          initialContentEn={refDoc.Content_en}
          initialContentAr={refDoc.Content_ar}
          initialReviewerComment={refDoc.reviewer_Comment || ''}
          additionalInfo={{
            version: refDoc.Version,
            crtDate: refDoc.Crt_Date,
            modifiedDate: refDoc.Modified_Date,
            crtBy: refDoc.Crt_by,
            modifiedBy: refDoc.Modified_by,
          }}
          historyData={history}
          userRole={userRole}
          onSave={onSave}
          onClose={() => setOpenDlg(false)}
        />
      )}
    </Box>
  );
};

export default ReferenceDocumentsSection;

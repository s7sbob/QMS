import React, { useEffect, useState, useContext } from 'react';
import axiosServices from 'src/utils/axiosServices';
import {
  Box,
  TableContainer,
  Table,
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

const ReferenceDocumentsSection: React.FC<{ initialData: ReferenceDoc | null; isReadOnly?: boolean }> = ({
  initialData,
  isReadOnly = false,
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
    if (!refDoc || isReadOnly) return;
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

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${refDoc.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (err) {
      console.error(err);
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
                  color: refDoc?.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                8. Reference Documents:
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
                  color: refDoc?.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                ٨- الوثائق المرجعية:
              </TableCell>
            </TableRow>
            {/* Content Row */}
            {refDoc && (
              <TableRow>
                <TableCell
                  sx={{
                    borderRight: '2px solid #000',
                    verticalAlign: 'top',
                    backgroundColor: '#fff',
                    padding: '12px',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: refDoc.Content_en }} />
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

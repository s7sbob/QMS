import React, { useEffect, useState } from 'react';
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
  const [refDoc, setRefDoc] = useState<ReferenceDoc | null>(null);
  const [openDlg, setOpenDlg] = useState(false);
  const [history, setHistory] = useState<ReferenceDoc[]>([]);

  useEffect(() => {
    if (initialData) setRefDoc(initialData);
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!refDoc) return;
    axiosServices
      .get(`/api/sopReferences/getAllHistory/${refDoc.Sop_HeaderId}`)
      .then((r) => {
        const inactive = r.data.filter((x: any) => x.Is_Active === 0);
        setHistory(inactive);
        setOpenDlg(true);
      })
      .catch((err) => console.error(err));
  };

  const onSave = (en: string, ar: string, comment: string) => {
    if (!refDoc) return;
    const isNew = en !== refDoc.Content_en || ar !== refDoc.Content_ar;
    const url = isNew
      ? '/api/sopReferences/addSop-References'
      : `/api/sopReferences/updateSop-References/${refDoc.Id}`;
    axiosServices
      .post(url, {
        Content_en: en,
        Content_ar: ar,
        reviewer_Comment: comment,
        Sop_HeaderId: refDoc.Sop_HeaderId,
      })
      .then((res) => {
        setRefDoc(res.data);
        setOpenDlg(false);
      })
      .catch((err) => console.error(err));
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
        <span>7. Reference Documents:</span>
        <span dir="rtl">7. الوثائق المرجعية</span>
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
            {refDoc && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: 'pointer' }}>
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
          historyData={history}
          onSave={onSave}
          onClose={() => setOpenDlg(false)}
        />
      )}
    </Box>
  );
};
export default ReferenceDocumentsSection;

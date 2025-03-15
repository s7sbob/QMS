import React, { useEffect, useState } from 'react';
import axiosServices from 'src/utils/axiosServices';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export interface Modification {
  date: string;
  change: string;
}

export interface Purpose {
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
  modificationLog?: Modification[];
  reviewer_Comment?: string | null;
}

interface PurposeSectionProps {
  initialData: Purpose | null;
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ initialData }) => {
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  // Editable fields للـ Current Record
  const [editContentEn, setEditContentEn] = useState<string>('');
  const [editContentAr, setEditContentAr] = useState<string>('');
  const [editReviewerComment, setEditReviewerComment] = useState<string>('');

  // History records (read-only)
  const [historicalPurposes, setHistoricalPurposes] = useState<Purpose[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setPurpose(initialData);
      setEditContentEn(initialData.Content_en);
      setEditContentAr(initialData.Content_ar);
      setEditReviewerComment(initialData.reviewer_Comment || '');
    }
  }, [initialData]);

  // عند double click يتم فتح الـ Dialog واسترجاع الـ History باستخدام Sop_HeaderId
  const handleDoubleClick = () => {
    if (!purpose) return;
    axiosServices
      .get(`/api/soppurpose/getAllHistory/${purpose.Sop_HeaderId}`)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 1);
        setHistoricalPurposes(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error('Error fetching historical purposes:', error));
  };

  // حفظ التعديلات على السجل الحالي (يتضمن Content و reviewer_Comment)
  const handleSave = () => {
    if (!purpose) return;
    axiosServices
      .put(`/api/soppurpose/updateSop-Purpose/${purpose.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
        reviewer_Comment: editReviewerComment,
      })
      .then((res) => {
        setPurpose(res.data);
        setOpenDialog(false);
      })
      .catch((error) => console.error('Error updating purpose:', error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ mt: 2, fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h6" gutterBottom>
        1. Purpose:
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
            {purpose && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: 'pointer' }}>
                <TableCell>{purpose.Content_en}</TableCell>
                <TableCell align="right" style={{ direction: 'rtl' }}>
                  {purpose.Content_ar}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>تفاصيل الغرض</DialogTitle>
        <DialogContent dividers>
          {/* Current Record Editable */}
          <Typography variant="h6" gutterBottom>
            Current Record
          </Typography>
          {purpose && (
            <Box sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
              <Stack spacing={2}>
                <TextField
                  label="English Content"
                  multiline
                  minRows={2}
                  value={editContentEn}
                  onChange={(e) => setEditContentEn(e.target.value)}
                />
                <TextField
                  label="Arabic Content"
                  multiline
                  minRows={2}
                  value={editContentAr}
                  onChange={(e) => setEditContentAr(e.target.value)}
                  inputProps={{ style: { textAlign: 'right', direction: 'rtl' } }}
                />
                <TextField
                  label="Reviewer Comment"
                  multiline
                  minRows={1}
                  value={editReviewerComment}
                  onChange={(e) => setEditReviewerComment(e.target.value)}
                  InputProps={{ style: { color: 'red' } }}
                />
                <Typography variant="body2">
                  <strong>Version:</strong> {purpose.Version}
                </Typography>
                <Typography variant="body2">
                  <strong>Crt_Date:</strong> {purpose.Crt_Date}
                </Typography>
                <Typography variant="body2">
                  <strong>Modified_Date:</strong> {purpose.Modified_Date || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Crt_by:</strong> {purpose.Crt_by}
                </Typography>
                <Typography variant="body2">
                  <strong>Modified_by:</strong> {purpose.Modified_by || 'N/A'}
                </Typography>
              </Stack>
            </Box>
          )}

          {/* History Section (read-only) */}
          <Typography variant="h6" gutterBottom>
            History (read-only)
          </Typography>
          {historicalPurposes.length > 0 ? (
            <List>
              {historicalPurposes.map((record) => (
                <ListItem key={record.Id} alignItems="flex-start">
                  <Box>
                    <Typography variant="body2">
                      <strong>Content (EN):</strong> {record.Content_en}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Content (AR):</strong> {record.Content_ar}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Version:</strong> {record.Version}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Crt_Date:</strong> {record.Crt_Date}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Modified_Date:</strong> {record.Modified_Date || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Crt_by:</strong> {record.Crt_by}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Modified_by:</strong> {record.Modified_by || 'N/A'}
                    </Typography>
                    {record.reviewer_Comment && (
                      <Typography variant="body2" sx={{ color: 'red' }}>
                        <strong>Reviewer Comment:</strong> {record.reviewer_Comment}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No historical records available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Current Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurposeSection;

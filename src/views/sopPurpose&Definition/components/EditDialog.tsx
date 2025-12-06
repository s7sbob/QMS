/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import RichTextEditor from 'src/views/documentation/pages/components/RichTextEditor.tsx';   // ⬅️ بدل ReactSummernote

export interface HistoryRecord {
  Id: string;
  Content_en: string;
  Content_ar: string;
  Version: number | null;
  Crt_Date: string;
  Modified_Date: string | null;
  Crt_by: string | null;
  Crt_by_Name?: string | null;
  Modified_by: string | null;
  reviewer_Comment?: string | null;
}

export interface AdditionalInfo {
  version?: number | null;
  crtDate?: string;
  modifiedDate?: string | null;
  crtBy?: string | null;
  crtByName?: string | null;
  modifiedBy?: string | null;
}

// Helper function to format date as dd/mm/yyyy hh:mm:ss
const formatDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

interface EditDialogProps {
  open: boolean;
  title: string;
  initialContentEn: string;
  initialContentAr: string;
  initialReviewerComment: string;
  additionalInfo?: AdditionalInfo;
  historyData?: HistoryRecord[];
  userRole?: string;
  onSave: (newContentEn: string, newContentAr: string, newReviewerComment: string) => void;
  onClose: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  title,
  initialContentEn,
  initialContentAr,
  initialReviewerComment,
  additionalInfo,
  historyData,
  userRole = '',
  onSave,
  onClose,
}) => {
  const [contentEn, setContentEn] = useState(initialContentEn);
  const [contentAr, setContentAr] = useState(initialContentAr);
  const [reviewerComment, setReviewerComment] = useState(initialReviewerComment);

  // Role-based permissions
  const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
  const isQAAssociate = userRole === 'QA Associate';
  const canEditContent = isQAAssociate || (!isReviewer && !isQAAssociate); // QA Associate or other roles can edit content
  const canEditComment = isReviewer; // Only QA Supervisor/Manager can add comments

  /* عند فتح الـ Dialog أعد مزامنة الحالة مع القيم الابتدائية */
  useEffect(() => {
    if (open) {
      setContentEn(initialContentEn);
      setContentAr(initialContentAr);
      setReviewerComment(initialReviewerComment);
    }
  }, [open, initialContentEn, initialContentAr, initialReviewerComment]);

  const handleSave = () => {
    // If QA Associate saves, clear the reviewer comment (title becomes black)
    const finalComment = isQAAssociate ? '' : reviewerComment;
    onSave(contentEn, contentAr, finalComment);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Current Record
        </Typography>

        <Box sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
          <Stack spacing={2}>
            {/* English Content */}
            <Typography variant="body2">English Content</Typography>
            {canEditContent ? (
              <RichTextEditor
                value={contentEn}
                onChange={setContentEn}
                language="en"
              />
            ) : (
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
                <div dangerouslySetInnerHTML={{ __html: contentEn }} />
              </Box>
            )}

            {/* Arabic Content */}
            <Typography variant="body2">Arabic Content</Typography>
            {canEditContent ? (
              <RichTextEditor
                value={contentAr}
                onChange={setContentAr}
                language="ar"
                dir="rtl"
              />
            ) : (
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#f9f9f9', direction: 'rtl' }}>
                <div dangerouslySetInnerHTML={{ __html: contentAr }} />
              </Box>
            )}

            {/* Reviewer Comment - Only visible for QA Supervisor/Manager */}
            {(canEditComment || reviewerComment) && (
              <>
                <Typography variant="body2" sx={{ color: reviewerComment ? 'red' : 'inherit' }}>
                  Reviewer Comment {isReviewer ? '' : '(Read Only)'}
                </Typography>
                {canEditComment ? (
                  <RichTextEditor
                    value={reviewerComment}
                    onChange={setReviewerComment}
                    language="en"
                  />
                ) : (
                  <Box sx={{ p: 2, border: '1px solid #ffcdd2', borderRadius: 1, backgroundColor: '#ffebee' }}>
                    <div dangerouslySetInnerHTML={{ __html: reviewerComment || 'No comment' }} />
                  </Box>
                )}
              </>
            )}

            {/* معلومات إضافية */}
            {additionalInfo && (
              <>
                {additionalInfo.crtDate && (
                  <Typography variant="body2">
                    <strong>Created Date:</strong> {formatDateTime(additionalInfo.crtDate)}
                  </Typography>
                )}
                {(additionalInfo.crtByName || additionalInfo.crtBy) && (
                  <Typography variant="body2">
                    <strong>Created By:</strong> {additionalInfo.crtByName || additionalInfo.crtBy}
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </Box>

        {/* السجلّ */}
        {historyData?.length ? (
          <>
            <Typography variant="h6" gutterBottom>
              History (read-only)
            </Typography>
            {historyData.map((r) => (
              <Box key={r.Id} sx={{ mb: 2, border: '1px solid #eee', p: 1, borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Content (EN):</strong>
                  <div dangerouslySetInnerHTML={{ __html: r.Content_en }} />
                </Typography>
                <Typography variant="body2">
                  <strong>Content (AR):</strong>
                  <div style={{ direction: 'rtl' }} dangerouslySetInnerHTML={{ __html: r.Content_ar }} />
                </Typography>
                <Typography variant="body2">
                  <strong>Created Date:</strong> {formatDateTime(r.Crt_Date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Created By:</strong> {r.Crt_by_Name || r.Crt_by}
                </Typography>
                {r.reviewer_Comment && (
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    <strong>Reviewer Comment:</strong> {r.reviewer_Comment}
                  </Typography>
                )}
              </Box>
            ))}
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Current Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;

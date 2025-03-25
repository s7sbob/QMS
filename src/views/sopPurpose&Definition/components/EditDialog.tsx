/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';

export interface HistoryRecord {
  Id: string;
  Content_en: string;
  Content_ar: string;
  Version: number | null;
  Crt_Date: string;
  Modified_Date: string | null;
  Crt_by: string | null;
  Modified_by: string | null;
  reviewer_Comment?: string | null;
}

export interface AdditionalInfo {
  version?: number | null;
  crtDate?: string;
  modifiedDate?: string | null;
  crtBy?: string | null;
  modifiedBy?: string | null;
}

interface EditDialogProps {
  open: boolean;
  title: string;
  initialContentEn: string;
  initialContentAr: string;
  initialReviewerComment: string;
  additionalInfo?: AdditionalInfo;
  historyData?: HistoryRecord[];
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
  onSave,
  onClose,
}) => {
  const [contentEn, setContentEn] = useState(initialContentEn);
  const [contentAr, setContentAr] = useState(initialContentAr);
  const [reviewerComment, setReviewerComment] = useState(initialReviewerComment);

  // Create refs for each editor instance
  const englishEditorRef = useRef<any>(null);
  const arabicEditorRef = useRef<any>(null);
  const reviewerEditorRef = useRef<any>(null);

  // Update local state and force-update the underlying Summernote editors when dialog opens
  useEffect(() => {
    if (open) {
      setContentEn(initialContentEn);
      setContentAr(initialContentAr);
      setReviewerComment(initialReviewerComment);

      // Force-update the editor content via the underlying Summernote API if the ref is set
      setTimeout(() => {
        if (englishEditorRef.current) {
          englishEditorRef.current.editor.summernote('code', initialContentEn);
        }
        if (arabicEditorRef.current) {
          arabicEditorRef.current.editor.summernote('code', initialContentAr);
        }
        if (reviewerEditorRef.current) {
          reviewerEditorRef.current.editor.summernote('code', initialReviewerComment);
        }
      }, 100);
    }
  }, [open, initialContentEn, initialContentAr, initialReviewerComment]);

  // Base Summernote options
  const baseSummernoteOptions = useMemo(
    () => ({
      height: 200,
      dialogsInBody: true,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
      ],
      callbacks: {
        onInit: () => console.log('Summernote initialized'),
      },
    }),
    [],
  );

  const englishOptions = baseSummernoteOptions;
  const arabicOptions = useMemo(
    () => ({
      ...baseSummernoteOptions,
      lang: 'ar',
    }),
    [baseSummernoteOptions],
  );

  const handleSave = () => {
    onSave(contentEn, contentAr, reviewerComment);
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
            <Typography variant="body2">English Content</Typography>
            <ReactSummernote
              ref={englishEditorRef}
              defaultValue={initialContentEn}
              options={englishOptions}
              onChange={(content: string) => setContentEn(content)}
            />

            <Typography variant="body2">Arabic Content</Typography>
            <ReactSummernote
              ref={arabicEditorRef}
              defaultValue={initialContentAr}
              options={arabicOptions}
              onChange={(content: string) => setContentAr(content)}
            />

            <Typography variant="body2">Reviewer Comment</Typography>
            <ReactSummernote
              ref={reviewerEditorRef}
              defaultValue={initialReviewerComment}
              options={englishOptions}
              onChange={(content: string) => setReviewerComment(content)}
            />

            {additionalInfo && (
              <>
                {additionalInfo.version !== undefined && (
                  <Typography variant="body2">
                    <strong>Version:</strong> {additionalInfo.version}
                  </Typography>
                )}
                {additionalInfo.crtDate && (
                  <Typography variant="body2">
                    <strong>Crt_Date:</strong> {additionalInfo.crtDate}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Modified_Date:</strong> {additionalInfo.modifiedDate || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Crt_by:</strong> {additionalInfo.crtBy}
                </Typography>
                <Typography variant="body2">
                  <strong>Modified_by:</strong> {additionalInfo.modifiedBy || 'N/A'}
                </Typography>
              </>
            )}
          </Stack>
        </Box>

        {historyData && historyData.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              History (read-only)
            </Typography>
            {historyData.map((record) => (
              <Box key={record.Id} sx={{ mb: 2, border: '1px solid #eee', p: 1, borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Content (EN):</strong>
                  <div dangerouslySetInnerHTML={{ __html: record.Content_en }} />
                </Typography>
                <Typography variant="body2">
                  <strong>Content (AR):</strong>
                  <div
                    style={{ direction: 'rtl' }}
                    dangerouslySetInnerHTML={{ __html: record.Content_ar }}
                  />
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
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Current Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;

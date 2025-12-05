/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Stack,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  IconDeviceFloppy,
  IconSend,
  IconPrinter,
  IconFileTypePdf,
} from '@tabler/icons-react';
import Swal from 'sweetalert2';

import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';
import OnlyOfficeEditor, { OnlyOfficeEditorRef } from 'src/components/OnlyOffice/OnlyOfficeEditor';
import EditDialog from '../components/EditDialog';
import { useOnlyOfficeEvents, getSectionDisplayName } from 'src/hooks/useOnlyOfficeEvents';
import Spinner from 'src/views/spinner/Spinner';

// Section API mapping
const SECTION_API_MAP: Record<string, { getHistory: string; update: string }> = {
  sop_purpose: {
    getHistory: '/api/soppurpose/getAllHistory',
    update: '/api/soppurpose/addSop-Purpose',
  },
  Sop_Definitions: {
    getHistory: '/api/sopDefinition/getAllHistory',
    update: '/api/sopDefinition/addSop-Definition',
  },
  Sop_Scope: {
    getHistory: '/api/sopScope/getAllHistory',
    update: '/api/sopScope/addSop-Scope',
  },
  Sop_Procedures: {
    getHistory: '/api/sopprocedures/getAllHistory',
    update: '/api/sopprocedures/addSop-Procedure',
  },
  Sop_Res: {
    getHistory: '/api/sopRes/getAllHistory',
    update: '/api/sopRes/SopReponsibility-create',
  },
  Sop_Safety_Concerns: {
    getHistory: '/api/sopSafetyConcerns/getAllHistory',
    update: '/api/sopSafetyConcerns/addSop-SafetyConcern',
  },
  sop_CriticalControlPoints: {
    getHistory: '/api/sopCriticalControlPoints/getAllHistory',
    update: '/api/sopCriticalControlPoints/addSop-CriticalControlPoint',
  },
  Sop_Refrences: {
    getHistory: '/api/sopRefrences/getAllHistory',
    update: '/api/sopRefrences/addSop-Reference',
  },
};

const SopFullDocument2: React.FC = () => {
  const { t } = useTranslation();
  const { id: headerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useContext(UserContext);
  const editorRef = useRef<OnlyOfficeEditorRef>(null);

  // Check if we're in temp mode (from URL query param)
  const isTempMode = searchParams.get('mode') === 'temp';

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [editorConfig, setEditorConfig] = useState<any>(null);
  const [sopHeader, setSopHeader] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tempDocumentKey, setTempDocumentKey] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogSection, setEditDialogSection] = useState<string>('');
  const [editDialogData, setEditDialogData] = useState<{
    contentEn: string;
    contentAr: string;
    reviewerComment: string;
    historyData: any[];
    additionalInfo: any;
  }>({
    contentEn: '',
    contentAr: '',
    reviewerComment: '',
    historyData: [],
    additionalInfo: {},
  });

  // User role
  const userRole =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  // Fetch editor configuration
  const fetchEditorConfig = useCallback(async () => {
    if (!headerId) return;

    try {
      setIsLoading(true);

      if (isTempMode) {
        // TEMP MODE: Generate a temp document (not tracked in database)
        const generateResponse = await axiosServices.post(`/api/onlyoffice/generate-temp/${headerId}`);
        const { documentKey, documentUrl } = generateResponse.data;
        setTempDocumentKey(documentKey);

        // Get editor config for temp document
        const configResponse = await axiosServices.get(`/api/onlyoffice/config-temp/${headerId}`, {
          params: {
            tempDocKey: documentKey,
            tempDocUrl: documentUrl,
          },
        });
        setEditorConfig(configResponse.data);
      } else {
        // PERMANENT MODE: Existing flow
        await axiosServices.post(`/api/onlyoffice/generate/${headerId}`);
        const configResponse = await axiosServices.get(`/api/onlyoffice/config/${headerId}`);
        setEditorConfig(configResponse.data);
      }

      // Fetch SOP header info
      const headerResponse = await axiosServices.get(`/api/sopheader/getSopHeaderById/${headerId}`);
      setSopHeader(headerResponse.data);

      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching editor config:', error);
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: t('messages.error') as string,
        text: error.message || 'Failed to load document editor',
      });
    }
  }, [headerId, t, isTempMode]);

  useEffect(() => {
    fetchEditorConfig();
  }, [fetchEditorConfig]);

  // Handle section click from ONLYOFFICE plugin
  const handleSectionClick = useCallback(
    async (sectionKey: string) => {
      if (!headerId) return;

      const apiConfig = SECTION_API_MAP[sectionKey];
      if (!apiConfig) {
        console.warn('Unknown section:', sectionKey);
        return;
      }

      try {
        // Fetch section history
        const response = await axiosServices.get(`${apiConfig.getHistory}/${headerId}`);
        const allRecords = response.data || [];

        // Find current active record
        const currentRecord = allRecords.find((r: any) => r.Is_Active === 1) || allRecords[0];
        const historyRecords = allRecords.filter((r: any) => r.Is_Active === 0);

        if (currentRecord) {
          setEditDialogData({
            contentEn: currentRecord.Content_en || '',
            contentAr: currentRecord.Content_ar || '',
            reviewerComment: currentRecord.reviewer_Comment || '',
            historyData: historyRecords,
            additionalInfo: {
              crtDate: currentRecord.Crt_Date,
              crtByName: currentRecord.Crt_by_Name || currentRecord.Crt_by,
            },
          });
          setEditDialogSection(sectionKey);
          setEditDialogOpen(true);
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
      }
    },
    [headerId]
  );

  // Memoized callbacks for OnlyOffice editor
  const handleDocumentReady = useCallback(() => {
    console.log('Document ready');
  }, []);

  const handleEditorError = useCallback((err: any) => {
    console.error('Editor error:', err);
  }, []);

  const handleDocumentSaved = useCallback(() => {
    console.log('Document saved');
  }, []);

  // Use ONLYOFFICE events hook
  useOnlyOfficeEvents({
    onSectionClick: handleSectionClick,
    onDocumentSaved: handleDocumentSaved,
  });

  // Handle dialog save
  const handleDialogSave = async (
    newContentEn: string,
    newContentAr: string,
    newReviewerComment: string
  ) => {
    if (!headerId || !editDialogSection) return;

    const apiConfig = SECTION_API_MAP[editDialogSection];
    if (!apiConfig) return;

    try {
      setIsSaving(true);

      // Save section content
      await axiosServices.post(apiConfig.update, {
        Sop_HeaderId: headerId,
        Content_en: newContentEn,
        Content_ar: newContentAr,
        reviewer_Comment: newReviewerComment,
        Crt_by: user?.Id,
      });

      // Regenerate document
      const regenerateResponse = await axiosServices.post(
        `/api/onlyoffice/update-section/${headerId}`
      );

      // Update editor with new document
      if (regenerateResponse.data?.documentKey) {
        // Reload editor with new config
        await fetchEditorConfig();
      }

      setEditDialogOpen(false);
      setIsSaving(false);

      Swal.fire({
        icon: 'success',
        title: t('messages.success') as string,
        text: t('messages.sectionUpdated') as string,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      setIsSaving(false);
      console.error('Error saving section:', error);
      Swal.fire({
        icon: 'error',
        title: t('messages.error') as string,
        text: error.message || 'Failed to save section',
      });
    }
  };

  // Handle Save Draft
  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      editorRef.current?.save();

      // Wait a bit for ONLYOFFICE to process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSaving(false);
      Swal.fire({
        icon: 'success',
        title: t('messages.success') as string,
        text: t('messages.draftSaved') as string,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      setIsSaving(false);
      Swal.fire({
        icon: 'error',
        title: t('messages.error') as string,
        text: error.message || 'Failed to save draft',
      });
    }
  };

  // Handle Submit for Review
  const handleSubmitForReview = async () => {
    if (!headerId) return;

    try {
      setIsSaving(true);

      // Save current document first
      editorRef.current?.save();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status to 2 (Pending Review)
      await axiosServices.patch(`/api/sopheader/updateSopStatusByAssociate/${headerId}`, {
        status: { newStatus: '2' },
        signedBy: user?.signUrl,
        issuedDate: new Date().toISOString(),
      });

      setIsSaving(false);

      Swal.fire({
        icon: 'success',
        title: t('messages.success') as string,
        text: t('messages.submittedForReview') as string,
      }).then(() => {
        navigate('/documentation-control');
      });
    } catch (error: any) {
      setIsSaving(false);
      Swal.fire({
        icon: 'error',
        title: t('messages.error') as string,
        text: error.message || 'Failed to submit for review',
      });
    }
  };

  // Handle Export to PDF
  const handleExportPdf = async () => {
    try {
      // ONLYOFFICE handles PDF export via its UI
      // Alternatively, we can use our conversion API
      const response = await axiosServices.post(`/api/onlyoffice/convert/${headerId}`);

      if (response.data?.pdfUrl) {
        window.open(response.data.pdfUrl, '_blank');
      } else {
        // Fallback: Use ONLYOFFICE's built-in download
        Swal.fire({
          icon: 'info',
          title: 'Export PDF',
          text: 'Use File > Download as > PDF from the editor menu',
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'info',
        title: 'Export PDF',
        text: 'Use File > Download as > PDF from the editor menu',
      });
    }
  };

  // Handle Print
  const handlePrint = () => {
    editorRef.current?.print();
  };

  // ============================================
  // TEMP MODE HANDLERS
  // ============================================

  // Handle Save as Final (promote temp document to permanent)
  const handleSaveAsFinal = async () => {
    if (!headerId || !tempDocumentKey) return;

    try {
      setIsPromoting(true);

      // Force save the current document first
      editorRef.current?.save();
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Promote temp document to permanent
      const response = await axiosServices.post(`/api/onlyoffice/promote/${headerId}`, {
        tempDocumentKey,
      });

      setIsPromoting(false);

      Swal.fire({
        icon: 'success',
        title: t('messages.success') as string,
        text: t('messages.documentSavedAsFinal') || 'Document has been saved and is now tracked in the system',
      }).then(() => {
        // Reload the page without temp mode (permanent document)
        navigate(`/SopFullDocument2/${headerId}`, { replace: true });
      });
    } catch (error: any) {
      setIsPromoting(false);
      console.error('Error promoting temp document:', error);
      Swal.fire({
        icon: 'error',
        title: t('messages.error') as string,
        text: error.response?.data?.error || error.message || 'Failed to save document as final',
      });
    }
  };

  // Handle Discard Changes (close without saving)
  const handleDiscardChanges = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: t('messages.confirmDiscard') || 'Discard Changes?',
      text: t('messages.discardChangesText') || 'All changes in this draft will be lost. This action cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: t('buttons.discard') || 'Discard',
      cancelButtonText: t('buttons.cancel') || 'Cancel',
    });

    if (result.isConfirmed) {
      // Navigate back to SOPFullDocument
      navigate(`/SOPFullDocument?headerId=${headerId}`);
    }
  };

  // Check if document is read-only
  const isReadOnly = parseInt(sopHeader?.status || '0', 10) >= 4;

  if (isLoading) {
    return <Spinner text="Loading Document Editor..." />;
  }

  if (!editorConfig) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Failed to load document editor</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 1 }} className="no-print">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">
              {sopHeader?.Doc_Title_en || 'SOP Document'}
              {sopHeader?.Doc_Code && ` (${sopHeader.Doc_Code})`}
            </Typography>
            {isTempMode && (
              <Typography
                variant="caption"
                sx={{
                  color: 'warning.main',
                  fontWeight: 'bold',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                DRAFT MODE - Changes are not saved to database until you click "Save as Final"
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Version: {sopHeader?.version || '00'}
          </Typography>
        </Stack>
      </Paper>

      {/* Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <OnlyOfficeEditor
          ref={editorRef}
          config={editorConfig}
          onSectionClick={handleSectionClick}
          onDocumentReady={handleDocumentReady}
          onError={handleEditorError}
        />
      </Box>

      {/* Bottom Action Buttons */}
      {!isReadOnly && (
        <Paper className="no-print" sx={{ p: 2, mt: 1 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {isTempMode ? (
              <>
                {/* TEMP MODE BUTTONS */}
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<IconDeviceFloppy />}
                  onClick={handleSaveAsFinal}
                  disabled={isPromoting || isSaving}
                >
                  {isPromoting ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    t('buttons.saveAsFinal') || 'Save as Final'
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleDiscardChanges}
                  disabled={isPromoting || isSaving}
                >
                  {t('buttons.discardChanges') || 'Discard Changes'}
                </Button>
              </>
            ) : (
              <>
                {/* PERMANENT MODE BUTTONS (existing) */}
                <Button
                  variant="outlined"
                  startIcon={<IconDeviceFloppy />}
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? <CircularProgress size={20} /> : t('buttons.saveDraft')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IconSend />}
                  onClick={handleSubmitForReview}
                  disabled={isSaving}
                >
                  {t('buttons.submitForReview')}
                </Button>
              </>
            )}
            {/* Common buttons for both modes */}
            <Button
              variant="outlined"
              startIcon={<IconFileTypePdf />}
              onClick={handleExportPdf}
              disabled={isSaving || isPromoting}
            >
              {t('buttons.exportPdf')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconPrinter />}
              onClick={handlePrint}
              disabled={isSaving || isPromoting}
            >
              {t('buttons.print')}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        title={`Edit ${getSectionDisplayName(editDialogSection).en}`}
        initialContentEn={editDialogData.contentEn}
        initialContentAr={editDialogData.contentAr}
        initialReviewerComment={editDialogData.reviewerComment}
        additionalInfo={editDialogData.additionalInfo}
        historyData={editDialogData.historyData}
        userRole={userRole}
        onSave={handleDialogSave}
        onClose={() => setEditDialogOpen(false)}
      />
    </Box>
  );
};

export default SopFullDocument2;

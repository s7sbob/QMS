/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ResponsibilitiesSection.tsx
import React, { useEffect, useState, useContext, useMemo } from 'react';
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
import { splitHtmlContent } from '../utils/htmlContentSplitter';

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
  isReadOnly?: boolean;
}

const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [responsibility, setResponsibility] = useState<Responsibility | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Responsibility[]>([]);
  const [creatorName, setCreatorName] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setResponsibility(initialData);
      if (initialData.Crt_by) {
        axiosServices.get(`/api/user/getUserById/${initialData.Crt_by}`)
          .then((res) => {
            const userData = res.data;
            if (userData) {
              setCreatorName(`${userData.FName || ''} ${userData.LName || ''}`.trim());
            }
          })
          .catch((err) => console.error('Error fetching creator name:', err));
      }
    }
  }, [initialData]);

  // Split content into chunks for pagination
  const contentChunks = useMemo(() => {
    if (!responsibility) return [];
    return splitHtmlContent(responsibility.Content_en || '', responsibility.Content_ar || '');
  }, [responsibility]);

  const handleDoubleClick = () => {
    if (!responsibility || isReadOnly) return;
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
      const response = await axiosServices.get(`/api/users/getUsersByRole/QA Associate`);
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

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${responsibility.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (error) {
      console.error('Error saving responsibility:', error);
    }
  };

  // Common table cell styles
  const cellStyleEn = {
    borderRight: '2px solid #000',
    verticalAlign: 'top' as const,
    backgroundColor: '#fff',
    padding: '12px',
    width: '50%',
  };

  const cellStyleAr = {
    direction: 'rtl' as const,
    verticalAlign: 'top' as const,
    backgroundColor: '#fff',
    padding: '12px',
    width: '50%',
  };

  const tableStyle = {
    tableLayout: 'fixed' as const,
    backgroundColor: '#fff',
    width: '100%',
  };

  // Render section header as a separate pageable element
  const renderSectionHeader = () => (
    <Box key="responsibilities-header" sx={{ mt: 0 }} className="pageable-section-header">
      <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
        <Table sx={tableStyle}>
          <TableBody>
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
                  color: responsibility && responsibility.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                4. Responsibilities:
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
                  color: responsibility && responsibility.reviewer_Comment ? 'red' : 'inherit',
                  padding: '8px 12px',
                }}
              >
                ٤- المسؤوليات:
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render each content chunk as a separate pageable element
  const renderContentChunk = (chunk: { id: string; htmlEn: string; htmlAr: string }, index: number) => (
    <Box key={`responsibilities-content-${index}`} sx={{ mt: 0 }} className="pageable-content-row">
      <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
        <Table sx={tableStyle}>
          <TableBody>
            <TableRow>
              <TableCell sx={cellStyleEn}>
                <div dangerouslySetInnerHTML={{ __html: chunk.htmlEn }} />
              </TableCell>
              <TableCell align="right" sx={cellStyleAr}>
                <div dangerouslySetInnerHTML={{ __html: chunk.htmlAr }} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Return multiple elements wrapped in a Fragment for pagination
  return (
    <>
      {/* Section Header - pageable element 1 */}
      {renderSectionHeader()}

      {/* Content Chunks - pageable elements 2+ */}
      {responsibility && contentChunks.map((chunk, index) => renderContentChunk(chunk, index))}

      {/* Edit Dialog - not pageable, positioned outside */}
      {responsibility && (
        <EditDialog
          open={openDialog}
          title="تفاصيل المسؤوليات"
          initialContentEn={responsibility.Content_en}
          initialContentAr={responsibility.Content_ar}
          initialReviewerComment={responsibility.reviewer_Comment || ''}
          additionalInfo={{
            crtDate: responsibility.Crt_Date,
            crtByName: creatorName,
          }}
          historyData={historyData}
          userRole={userRole}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default ResponsibilitiesSection;

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ScopeSection.tsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import axiosServices from "src/utils/axiosServices";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import EditDialog from "./EditDialog";
import { UserContext } from "src/context/UserContext";
import { splitHtmlContent } from "../utils/htmlContentSplitter";

export interface Scope {
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

interface ScopeSectionProps {
  initialData: Scope | null;
  isReadOnly?: boolean;
}

const ScopeSection: React.FC<ScopeSectionProps> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [scope, setScope] = useState<Scope | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Scope[]>([]);
  const [creatorName, setCreatorName] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setScope(initialData);
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
    if (!scope) return [];
    return splitHtmlContent(scope.Content_en || '', scope.Content_ar || '');
  }, [scope]);

  const handleDoubleClick = () => {
    if (!scope || isReadOnly) return;
    axiosServices
      .get(`/api/sopScope/getAllHistory/${scope.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical scope:", error));
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

  const handleDialogSave = async (newContentEn: string, newContentAr: string, newReviewerComment: string) => {
    if (!scope) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== scope.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== scope.Content_en || newContentAr !== scope.Content_ar) {
        res = await axiosServices.post("/api/sopScope/addSop-Scope", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: scope.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/sopScope/updateSop-Scope/${scope.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setScope(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(scope.Sop_HeaderId, 'Scope');

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${scope.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (error) {
      console.error("Error saving scope:", error);
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
    <Box key="scope-header" sx={{ mt: 0 }} className="pageable-section-header">
      <TableContainer sx={{ border: "none", boxShadow: "none" }}>
        <Table sx={tableStyle}>
          <TableBody>
            <TableRow
              onDoubleClick={handleDoubleClick}
              sx={{
                cursor: isReadOnly ? "default" : "pointer",
                "&:hover": { "& td": { backgroundColor: isReadOnly ? "#fff" : "#f5f5f5" } },
              }}
            >
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "50%",
                  borderRight: "2px solid #000",
                  borderBottom: "none",
                  backgroundColor: "#fff",
                  color: scope && scope.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                3. Scope:
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "50%",
                  direction: "rtl",
                  borderBottom: "none",
                  backgroundColor: "#fff",
                  color: scope && scope.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                ٣- النطاق:
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render each content chunk as a separate pageable element
  const renderContentChunk = (chunk: { id: string; htmlEn: string; htmlAr: string }, index: number) => (
    <Box key={`scope-content-${index}`} sx={{ mt: 0 }} className="pageable-content-row">
      <TableContainer sx={{ border: "none", boxShadow: "none" }}>
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
      {scope && contentChunks.map((chunk, index) => renderContentChunk(chunk, index))}

      {/* Edit Dialog - not pageable, positioned outside */}
      {scope && (
        <EditDialog
          open={openDialog}
          title="تفاصيل النطاق"
          initialContentEn={scope.Content_en}
          initialContentAr={scope.Content_ar}
          initialReviewerComment={scope.reviewer_Comment || ""}
          additionalInfo={{
            crtDate: scope.Crt_Date,
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

export default ScopeSection;

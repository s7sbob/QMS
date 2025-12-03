// src/components/PurposeSection.tsx
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
  modificationLog?: { date: string; change: string }[];
  reviewer_Comment?: string | null;
}

interface PurposeSectionProps {
  initialData: Purpose | null;
  isReadOnly?: boolean;
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Purpose[]>([]);
  const [creatorName, setCreatorName] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setPurpose(initialData);
      // Fetch creator name if Crt_by exists
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
    if (!purpose) return [];
    return splitHtmlContent(purpose.Content_en || '', purpose.Content_ar || '');
  }, [purpose]);

  const handleDoubleClick = () => {
    if (!purpose || isReadOnly) return;
    axiosServices
      .get(`/api/soppurpose/getAllHistory/${purpose.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical purposes:", error));
  };

  // Send notification to QA Associates when a comment is added
  const sendNotificationToQAAssociates = async (headerId: string, sectionName: string) => {
    try {
      // Get all QA Associates for the department
      const response = await axiosServices.get(`/api/users/getUsersByRole/QA Associate`);
      const qaAssociates = response.data || [];

      // Send notification to each QA Associate
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
    if (!purpose) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== purpose.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== purpose.Content_en || newContentAr !== purpose.Content_ar) {
        res = await axiosServices.post("/api/soppurpose/addSop-Purpose", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: purpose.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/soppurpose/updateSop-Purpose/${purpose.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setPurpose(res.data);
      setOpenDialog(false);

      // Send notification if reviewer added a new comment
      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(purpose.Sop_HeaderId, 'Purpose');

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${purpose.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (error) {
      console.error("Error saving purpose:", error);
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
    <Box key="purpose-header" sx={{ mt: 0 }} className="pageable-section-header">
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
                  color: purpose && purpose.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                1. Purpose:
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
                  color: purpose && purpose.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                ١- الغرض :
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render each content chunk as a separate pageable element
  const renderContentChunk = (chunk: { id: string; htmlEn: string; htmlAr: string }, index: number) => (
    <Box key={`purpose-content-${index}`} sx={{ mt: 0 }} className="pageable-content-row">
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
      {purpose && contentChunks.map((chunk, index) => renderContentChunk(chunk, index))}

      {/* Edit Dialog - not pageable, positioned outside */}
      {purpose && (
        <EditDialog
          open={openDialog}
          title="تفاصيل الغرض"
          initialContentEn={purpose.Content_en}
          initialContentAr={purpose.Content_ar}
          initialReviewerComment={purpose.reviewer_Comment || ""}
          additionalInfo={{
            crtDate: purpose.Crt_Date,
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

export default PurposeSection;

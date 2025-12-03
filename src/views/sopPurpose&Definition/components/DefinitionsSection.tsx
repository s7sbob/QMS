// src/components/DefinitionsSection.tsx
import React, { useEffect, useState, useContext } from "react";
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

export interface Definition {
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

interface DefinitionsSectionProps {
  initialData: Definition | null;
  isReadOnly?: boolean;
}

const DefinitionsSection: React.FC<DefinitionsSectionProps> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [definition, setDefinition] = useState<Definition | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Definition[]>([]);
  const [creatorName, setCreatorName] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDefinition(initialData);
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

  const handleDoubleClick = () => {
    if (!definition || isReadOnly) return;
    axiosServices
      .get(`/api/sopDefinition/getAllHistory/${definition.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical definitions:", error));
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

  const handleDialogSave = async (
    newContentEn: string,
    newContentAr: string,
    newReviewerComment: string
  ) => {
    if (!definition) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== definition.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== definition.Content_en || newContentAr !== definition.Content_ar) {
        res = await axiosServices.post("/api/sopDefinition/addSop-Definition", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: definition.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/sopDefinition/updateSop-Definition/${definition.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setDefinition(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(definition.Sop_HeaderId, 'Definitions');

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${definition.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (error) {
      console.error("Error saving definition:", error);
    }
  };

  return (
    <Box sx={{ mt: 0 }}>
      <TableContainer sx={{ border: "none", boxShadow: "none" }}>
        <Table sx={{ tableLayout: "fixed", backgroundColor: "#fff" }}>
          <TableBody>
            {/* Section Title Row - Gray Background */}
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
                  color: definition && definition.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                2. Definitions:
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
                  color: definition && definition.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                ٢- التعريفات:
              </TableCell>
            </TableRow>
            {/* Content Row */}
            {definition && (
              <TableRow>
                <TableCell
                  sx={{
                    borderRight: "2px solid #000",
                    verticalAlign: "top",
                    backgroundColor: "#fff",
                    padding: "12px",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: definition.Content_en }} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    direction: "rtl",
                    verticalAlign: "top",
                    backgroundColor: "#fff",
                    padding: "12px",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: definition.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {definition && (
        <EditDialog
          open={openDialog}
          title="تفاصيل التعريف"
          initialContentEn={definition.Content_en}
          initialContentAr={definition.Content_ar}
          initialReviewerComment={definition.reviewer_Comment || ""}
          additionalInfo={{
            crtDate: definition.Crt_Date,
            crtByName: creatorName,
          }}
          historyData={historyData}
          userRole={userRole}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default DefinitionsSection;

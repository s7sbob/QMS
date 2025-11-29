// src/components/ScopeSection.tsx
import React, { useEffect, useState, useContext } from "react";
import axiosServices from "src/utils/axiosServices";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import EditDialog from "./EditDialog";
import { UserContext } from "src/context/UserContext";

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
}

const ScopeSection: React.FC<ScopeSectionProps> = ({ initialData }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [scope, setScope] = useState<Scope | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Scope[]>([]);

  useEffect(() => {
    if (initialData) {
      setScope(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!scope) return;
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
      }
    } catch (error) {
      console.error("Error saving scope:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", justifyContent: "space-between",     color: scope && scope.reviewer_Comment ? "red" : "inherit", // الشرط هنا لتلوين العنوان بالاحمر عند وجود تعليق
 }}>
        <span>3. Scope:</span>
        <span dir="rtl">3. النطاق</span>
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }}>English Content</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }} align="right">
                المحتوى العربي
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scope && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: scope.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  <div dangerouslySetInnerHTML={{ __html: scope.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {scope && (
        <EditDialog
          open={openDialog}
          title="تفاصيل النطاق"
          initialContentEn={scope.Content_en}
          initialContentAr={scope.Content_ar}
          initialReviewerComment={scope.reviewer_Comment || ""}
          additionalInfo={{
            version: scope.Version,
            crtDate: scope.Crt_Date,
            modifiedDate: scope.Modified_Date,
            crtBy: scope.Crt_by,
            modifiedBy: scope.Modified_by,
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

export default ScopeSection;

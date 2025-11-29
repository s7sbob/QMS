// src/components/SafetyConcernsSection.tsx
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

export interface SafetyConcern {
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

interface SafetyConcernsSectionProps {
  initialData: SafetyConcern | null;
}

const SafetyConcernsSection: React.FC<SafetyConcernsSectionProps> = ({ initialData }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [safetyConcern, setSafetyConcern] = useState<SafetyConcern | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<SafetyConcern[]>([]);

  useEffect(() => {
    if (initialData) {
      setSafetyConcern(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!safetyConcern) return;
    axiosServices
      .get(`/api/sopSafetyConcerns/getAllHistory/${safetyConcern.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical safety concerns:", error));
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
    if (!safetyConcern) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = newReviewerComment && newReviewerComment !== safetyConcern.reviewer_Comment;

    try {
      let res;
      if (newContentEn !== safetyConcern.Content_en || newContentAr !== safetyConcern.Content_ar) {
        res = await axiosServices.post("/api/sopSafetyConcerns/addSop-SafetyConcerns", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: safetyConcern.Sop_HeaderId,
        });
      } else {
        res = await axiosServices.post(`/api/sopSafetyConcerns/updateSop-SafetyConcerns/${safetyConcern.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        });
      }

      setSafetyConcern(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(safetyConcern.Sop_HeaderId, 'Safety Concerns');
      }
    } catch (error) {
      console.error("Error saving safety concern:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", justifyContent: "space-between",     color: safetyConcern && safetyConcern.reviewer_Comment ? "red" : "inherit", // الشرط هنا لتلوين العنوان بالاحمر عند وجود تعليق
 }}>
        <span>5. Safety Concerns:</span>
        <span dir="rtl">5. اشتراطات السلامة</span>
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
            {safetyConcern && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: safetyConcern.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  <div dangerouslySetInnerHTML={{ __html: safetyConcern.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {safetyConcern && (
        <EditDialog
          open={openDialog}
          title="تفاصيل اشتراطات السلامة"
          initialContentEn={safetyConcern.Content_en}
          initialContentAr={safetyConcern.Content_ar}
          initialReviewerComment={safetyConcern.reviewer_Comment || ""}
          additionalInfo={{
            version: safetyConcern.Version,
            crtDate: safetyConcern.Crt_Date,
            modifiedDate: safetyConcern.Modified_Date,
            crtBy: safetyConcern.Crt_by,
            modifiedBy: safetyConcern.Modified_by,
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

export default SafetyConcernsSection;

/* ───────────────────────────────────────────────────────────────
   CriticalControlPointsSection.tsx
   § يظهر قسم "Critical Control Points" داخل مستند الـ SOP
   ─────────────────────────────────────────────────────────────── */
import React, { useEffect, useState, useContext } from "react";
import axiosServices from "src/utils/axiosServices";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditDialog, { HistoryRecord } from "./EditDialog"; // ⬅️ استيراد النوع
import { UserContext } from "src/context/UserContext";

/* ── نوع السجل الأساسى الراجع من الـ API ─────────────────────── */
export interface CriticalControlPoint {
  Id: string;
  Content_en: string;  // API returns Content_en
  Content_ar: string;  // API returns Content_ar
  Version: number | null;
  Is_Current: number;
  Is_Active: number;
  Crt_Date: string;
  Crt_by: string | null;
  Modified_Date: string | null;
  Modified_by: string | null;
  Sop_HeaderId: string;
  reviewer_Comment?: string | null;
}

/* ── Props الخاصة بالقسم ─────────────────────────────────────── */
interface Props {
  initialData: CriticalControlPoint | null;
}

/* ── تحويل سجل CCP → HistoryRecord  (لتوافق EditDialog) ─────── */
const toHistoryRecord = (rec: CriticalControlPoint): HistoryRecord => ({
  Id             : rec.Id,
  Content_en     : rec.Content_en,
  Content_ar     : rec.Content_ar,
  Version        : rec.Version,
  Crt_Date       : rec.Crt_Date,
  Modified_Date  : rec.Modified_Date,
  Crt_by         : rec.Crt_by,
  Modified_by    : rec.Modified_by,
  reviewer_Comment: rec.reviewer_Comment,
});

/* ── مكوّن القسم ─────────────────────────────────────────────── */
const CriticalControlPointsSection: React.FC<Props> = ({ initialData }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [ccp, setCcp]               = useState<CriticalControlPoint | null>(null);
  const [history, setHistory]       = useState<HistoryRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  /* عند تغيّر الـ prop من الأب */
  useEffect(() => { if (initialData) setCcp(initialData); }, [initialData]);

  /* ───── فتح الـ dialog مع جلب التاريخ ─────────────────────── */
  const handleDoubleClick = () => {
    if (!ccp) return;

    axiosServices
      .get(`/api/sopCriticalControlPoints/getAllHistory/${ccp.Sop_HeaderId}`)
      .then(res => {
        const hist: HistoryRecord[] = res.data
          .filter((r: any) => r.Is_Active === 0) // inactive ⇒ تاريخ
          .map(toHistoryRecord);
        setHistory(hist);
        setOpenDialog(true);
      })
      .catch(err => console.error("CCP history fetch error:", err));
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

  /* ───── حفظ (تحديث أو إضافة نسخة جديدة) ─────────────────── */
  const handleSave = async (
    newEn: string,
    newAr: string,
    reviewerComment: string,
  ) => {
    if (!ccp) return;

    const isReviewer = userRole === 'QA Supervisor' || userRole === 'QA Manager';
    const hasNewComment = reviewerComment && reviewerComment !== ccp.reviewer_Comment;

    const data = {
      Content_en : newEn,
      Content_ar : newAr,
      reviewer_Comment: reviewerComment,
      Sop_HeaderId    : ccp.Sop_HeaderId,
    };

    try {
      const res = (newEn !== ccp.Content_en || newAr !== ccp.Content_ar)
        ? await axiosServices.post("/api/sopCriticalControlPoints/add", data)              // insert
        : await axiosServices.post(`/api/sopCriticalControlPoints/updateSop-CriticalControlPoint/${ccp.Id}`, data); // update

      setCcp(res.data); // حدِّث النسخة الحالية من الخادم
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(ccp.Sop_HeaderId, 'Critical Control Points');
      }
    } catch (err) {
      console.error("CCP save error:", err);
    }
  };

  /* ───── واجهة المستخدم ───────────────────────────────────── */
  return (
    <Box sx={{ mt: 2 }}>
      {/* رأس القسم */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display : "flex",
          justifyContent: "space-between",
          color   : ccp?.reviewer_Comment ? "red" : "inherit",
        }}
      >
        <span>7. Critical Control Points:</span>
        <span dir="rtl">7. نقاط التحكم الحرجة</span>
      </Typography>

      {/* الجدول */}
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }}>English</TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "50%" }}
                align="right"
              >
                العربية
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ccp && (
              <TableRow
                hover
                sx={{ cursor: "pointer" }}
                onDoubleClick={handleDoubleClick}
              >
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: ccp.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  <div dangerouslySetInnerHTML={{ __html: ccp.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* الـ Dialog */}
      {ccp && (
        <EditDialog
          open={openDialog}
          title="تفاصيل نقطة التحكم الحرجة"
          initialContentEn={ccp.Content_en}
          initialContentAr={ccp.Content_ar}
          initialReviewerComment={ccp.reviewer_Comment || ""}
          additionalInfo={{
            version     : ccp.Version,
            crtDate     : ccp.Crt_Date,
            modifiedDate: ccp.Modified_Date,
            crtBy       : ccp.Crt_by,
            modifiedBy  : ccp.Modified_by,
          }}
          historyData={history}
          userRole={userRole}
          onSave={handleSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default CriticalControlPointsSection;

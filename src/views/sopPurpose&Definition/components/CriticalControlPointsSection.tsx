/* ───────────────────────────────────────────────────────────────
   CriticalControlPointsSection.tsx
   § يظهر قسم "Critical Control Points" داخل مستند الـ SOP
   ─────────────────────────────────────────────────────────────── */
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
import EditDialog, { HistoryRecord } from "./EditDialog";
import { UserContext } from "src/context/UserContext";
import { splitHtmlContent } from "../utils/htmlContentSplitter";

/* ── نوع السجل الأساسى الراجع من الـ API ─────────────────────── */
export interface CriticalControlPoint {
  Id: string;
  Content_en: string;
  Content_ar: string;
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
  isReadOnly?: boolean;
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
const CriticalControlPointsSection: React.FC<Props> = ({ initialData, isReadOnly = false }) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';

  const [ccp, setCcp]               = useState<CriticalControlPoint | null>(null);
  const [history, setHistory]       = useState<HistoryRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  /* عند تغيّر الـ prop من الأب */
  useEffect(() => { if (initialData) setCcp(initialData); }, [initialData]);

  // Split content into chunks for pagination
  const contentChunks = useMemo(() => {
    if (!ccp) return [];
    return splitHtmlContent(ccp.Content_en || '', ccp.Content_ar || '');
  }, [ccp]);

  /* ───── فتح الـ dialog مع جلب التاريخ ─────────────────────── */
  const handleDoubleClick = () => {
    if (!ccp || isReadOnly) return;

    axiosServices
      .get(`/api/sopCriticalControlPoints/getAllHistory/${ccp.Sop_HeaderId}`)
      .then(res => {
        const hist: HistoryRecord[] = res.data
          .filter((r: any) => r.Is_Active === 0)
          .map(toHistoryRecord);
        setHistory(hist);
        setOpenDialog(true);
      })
      .catch(err => console.error("CCP history fetch error:", err));
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
        ? await axiosServices.post("/api/sopCriticalControlPoints/add", data)
        : await axiosServices.post(`/api/sopCriticalControlPoints/updateSop-CriticalControlPoint/${ccp.Id}`, data);

      setCcp(res.data);
      setOpenDialog(false);

      if (isReviewer && hasNewComment) {
        await sendNotificationToQAAssociates(ccp.Sop_HeaderId, 'Critical Control Points');

        // Update SOP header status to 3 when QA Supervisor adds a comment
        if (userRole === 'QA Supervisor') {
          await axiosServices.patch(
            `/api/sopheader/updateSopStatusByReviewer/${ccp.Sop_HeaderId}`,
            { status: { newStatus: '3' } }
          );
        }
      }
    } catch (err) {
      console.error("CCP save error:", err);
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
    <Box key="ccp-header" sx={{ mt: 0 }} className="pageable-section-header">
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
                  color: ccp?.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                7. Critical Control Points:
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
                  color: ccp?.reviewer_Comment ? "red" : "inherit",
                  padding: "8px 12px",
                }}
              >
                ٧- نقاط التحكم الحرجة:
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render each content chunk as a separate pageable element
  const renderContentChunk = (chunk: { id: string; htmlEn: string; htmlAr: string }, index: number) => (
    <Box key={`ccp-content-${index}`} sx={{ mt: 0 }} className="pageable-content-row">
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

  /* ───── واجهة المستخدم ───────────────────────────────────── */
  return (
    <>
      {/* Section Header - pageable element 1 */}
      {renderSectionHeader()}

      {/* Content Chunks - pageable elements 2+ */}
      {ccp && contentChunks.map((chunk, index) => renderContentChunk(chunk, index))}

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
    </>
  );
};

export default CriticalControlPointsSection;

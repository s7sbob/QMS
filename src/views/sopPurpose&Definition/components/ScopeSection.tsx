// src/components/ScopeSection.tsx
import React, { useEffect, useState } from "react";
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

  const handleDialogSave = (newContentEn: string, newContentAr: string, newReviewerComment: string) => {
    if (!scope) return;
    if (newContentEn !== scope.Content_en || newContentAr !== scope.Content_ar) {
      axiosServices
        .post("/api/sopScope/addSop-Scope", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: scope.Sop_HeaderId,
        })
        .then((res) => {
          setScope(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error inserting scope:", error));
    } else {
      axiosServices
        .post(`/api/sopScope/updateSop-Scope/${scope.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        })
        .then((res) => {
          setScope(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating scope:", error));
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
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default ScopeSection;

// src/components/ProceduresSection.tsx
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

export interface Procedure {
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

interface ProceduresSectionProps {
  initialData: Procedure | null;
}

const ProceduresSection: React.FC<ProceduresSectionProps> = ({ initialData }) => {
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Procedure[]>([]);

  useEffect(() => {
    if (initialData) {
      setProcedure(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!procedure) return;
    axiosServices
      .get(`/api/sopprocedures/getAllHistory/${procedure.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical procedures:", error));
  };

  const handleDialogSave = (newContentEn: string, newContentAr: string, newReviewerComment: string) => {
    if (!procedure) return;
    if (newContentEn !== procedure.Content_en || newContentAr !== procedure.Content_ar) {
      axiosServices
        .post("/api/soprocedures/addSop-Procedure", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: procedure.Sop_HeaderId,
        })
        .then((res) => {
          setProcedure(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error inserting procedure:", error));
    } else {
      axiosServices
        .post(`/api/soprocedures/updateSop-Procedure/${procedure.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        })
        .then((res) => {
          setProcedure(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating procedure:", error));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", justifyContent: "space-between",     color: procedure && procedure.reviewer_Comment ? "red" : "inherit", // الشرط هنا لتلوين العنوان بالاحمر عند وجود تعليق
 }}>
        <span>4. Procedures:</span>
        <span dir="rtl">4. الإجراءات</span>
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
            {procedure && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: procedure.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  <div dangerouslySetInnerHTML={{ __html: procedure.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {procedure && (
        <EditDialog
          open={openDialog}
          title="تفاصيل الإجراءات"
          initialContentEn={procedure.Content_en}
          initialContentAr={procedure.Content_ar}
          initialReviewerComment={procedure.reviewer_Comment || ""}
          additionalInfo={{
            version: procedure.Version,
            crtDate: procedure.Crt_Date,
            modifiedDate: procedure.Modified_Date,
            crtBy: procedure.Crt_by,
            modifiedBy: procedure.Modified_by,
          }}
          historyData={historyData}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default ProceduresSection;

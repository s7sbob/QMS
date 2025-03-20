// src/components/PurposeSection.tsx
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
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ initialData }) => {
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Purpose[]>([]);

  useEffect(() => {
    if (initialData) {
      setPurpose(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!purpose) return;
    axiosServices
      .get(`/api/soppurpose/getAllHistory/${purpose.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical purposes:", error));
  };

  const handleDialogSave = (newContentEn: string, newContentAr: string, newReviewerComment: string) => {
    if (!purpose) return;
    if (newContentEn !== purpose.Content_en || newContentAr !== purpose.Content_ar) {
      axiosServices
        .post("/api/soppurpose/addSop-Purpose", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: purpose.Sop_HeaderId,
        })
        .then((res) => {
          setPurpose(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error inserting purpose:", error));
    } else {
      axiosServices
        .post(`/api/soppurpose/updateSop-Purpose/${purpose.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        })
        .then((res) => {
          setPurpose(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating purpose:", error));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>1. Purpose:</span>
        <span dir="rtl">1. الغرض</span>
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
            {purpose && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: purpose.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  <div dangerouslySetInnerHTML={{ __html: purpose.Content_ar }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {purpose && (
        <EditDialog
          open={openDialog}
          title="تفاصيل الغرض"
          initialContentEn={purpose.Content_en}
          initialContentAr={purpose.Content_ar}
          initialReviewerComment={purpose.reviewer_Comment || ""}
          additionalInfo={{
            version: purpose.Version,
            crtDate: purpose.Crt_Date,
            modifiedDate: purpose.Modified_Date,
            crtBy: purpose.Crt_by,
            modifiedBy: purpose.Modified_by,
          }}
          historyData={historyData}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default PurposeSection;

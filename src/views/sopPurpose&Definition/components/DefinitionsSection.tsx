// src/components/DefinitionsSection.tsx
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
}

const DefinitionsSection: React.FC<DefinitionsSectionProps> = ({ initialData }) => {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [historyData, setHistoryData] = useState<Definition[]>([]);

  useEffect(() => {
    if (initialData) {
      setDefinition(initialData);
    }
  }, [initialData]);

  const handleDoubleClick = () => {
    if (!definition) return;
    axiosServices
      .get(`/api/sopDefinition/getAllHistory/${definition.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoryData(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical definitions:", error));
  };

  const handleDialogSave = (
    newContentEn: string,
    newContentAr: string,
    newReviewerComment: string
  ) => {
    if (!definition) return;
    if (newContentEn !== definition.Content_en || newContentAr !== definition.Content_ar) {
      axiosServices
        .post("/api/sopDefinition/addSop-Definition", {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
          Sop_HeaderId: definition.Sop_HeaderId,
        })
        .then((res) => {
          setDefinition(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error inserting definition:", error));
    } else {
      axiosServices
        .post(`/api/sopDefinition/updateSop-Definition/${definition.Id}`, {
          Content_en: newContentEn,
          Content_ar: newContentAr,
          reviewer_Comment: newReviewerComment,
        })
        .then((res) => {
          setDefinition(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating definition:", error));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", justifyContent: "space-between",     color: definition && definition.reviewer_Comment ? "red" : "inherit", // الشرط هنا لتلوين العنوان بالاحمر عند وجود تعليق
        }}
      >
        <span>2. Definitions:</span>
        <span dir="rtl">2. التعاريف</span>
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }}>
                English Content
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }} align="right">
                المحتوى العربي
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {definition && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: definition.Content_en }} />
                </TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
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
            version: definition.Version,
            crtDate: definition.Crt_Date,
            modifiedDate: definition.Modified_Date,
            crtBy: definition.Crt_by,
            modifiedBy: definition.Modified_by,
          }}
          historyData={historyData}
          onSave={handleDialogSave}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default DefinitionsSection;

// src/components/DefinitionsSection.tsx

import React, { useEffect, useState } from "react";
import axiosServices from "src/utils/axiosServices";

// استيراد مكونات MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
} from "@mui/material";

// واجهة سجل التعديلات
interface Modification {
  date: string;
  change: string;
}

// واجهة بيانات الـ Definition
interface Definition {
  Id: string;
  Content_en: string;
  Content_ar: string;
  Version: number;
  Is_Current: number;
  Crt_Date: string;
  Crt_by: string;
  Modified_Date: string | null;
  Modified_by: string | null;
  Sop_HeaderId: string;
  Is_Active: number;
  modificationLog?: Modification[];
}

const DefinitionsSection: React.FC = () => {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [selectedDefinition, setSelectedDefinition] = useState<Definition | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // الحقول التي سيتم التعديل عليها
  const [editContentEn, setEditContentEn] = useState<string>("");
  const [editContentAr, setEditContentAr] = useState<string>("");

  // جلب جميع التعريفات عند تحميل المكون
  useEffect(() => {
    axiosServices
      .get("/api/sopDefinition/getAllSop-Definition")
      .then((res) => {
        setDefinitions(res.data);
      })
      .catch((error) => console.error("Error fetching definitions:", error));
  }, []);

  // عند النقر المزدوج على صف في الجدول
  const handleDoubleClick = (id: string) => {
    axiosServices
      .get(`/api/sopDefinition/getSop-Definition/${id}`)
      .then((res) => {
        setSelectedDefinition(res.data);
        // تعبئة الحقول بالقيم الحالية
        setEditContentEn(res.data.Content_en);
        setEditContentAr(res.data.Content_ar);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching definition:", error));
  };

  // إغلاق الـ Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDefinition(null);
  };

  // حفظ التعديل وإرساله للـ API
  const handleSave = () => {
    if (!selectedDefinition) return;

    axiosServices
      .put(`/api/sopDefinition/updateSop-Definition/${selectedDefinition.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
      })
      .then((res) => {
        // تحديث القائمة في الواجهة
        setDefinitions((prev) =>
          prev.map((def) => (def.Id === selectedDefinition.Id ? res.data : def))
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating definition:", error));
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h6" gutterBottom>
        2. Definitions:
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
            {definitions.map((def) => (
              <TableRow
                key={def.Id}
                onDoubleClick={() => handleDoubleClick(def.Id)}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{def.Content_en}</TableCell>
                <TableCell align="right" sx={{ direction: "rtl" }}>
                  {def.Content_ar}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog لعرض التفاصيل والتعديل */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>تفاصيل التعريف</DialogTitle>
        <DialogContent dividers>
          {selectedDefinition && (
            <Box>
              {/* عرض معلومات عامة */}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Id:</strong> {selectedDefinition.Id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Version:</strong> {selectedDefinition.Version}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Crt_Date:</strong> {selectedDefinition.Crt_Date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modified_Date:</strong>{" "}
                {selectedDefinition.Modified_Date || "N/A"}
              </Typography>

              {/* حقول التعديل */}
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="English Content"
                  multiline
                  minRows={2}
                  value={editContentEn}
                  onChange={(e) => setEditContentEn(e.target.value)}
                />
                <TextField
                  label="Arabic Content"
                  multiline
                  minRows={2}
                  value={editContentAr}
                  onChange={(e) => setEditContentAr(e.target.value)}
                  inputProps={{ style: { textAlign: "right", direction: "rtl" } }}
                />
              </Stack>

              {/* عرض سجل التعديلات إن وجد */}
              {selectedDefinition.modificationLog && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">سجل التعديلات:</Typography>
                  <List>
                    {selectedDefinition.modificationLog.map((log, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemText
                          primary={log.change}
                          secondary={log.date}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            إلغاء
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DefinitionsSection;

// src/components/PurposeSection.tsx

import React, { useEffect, useState } from "react";
import axiosServices from "src/utils/axiosServices";

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

interface Modification {
  date: string;
  change: string;
}

interface Purpose {
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

const PurposeSection: React.FC = () => {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // الحقول التي سيتم التعديل عليها
  const [editContentEn, setEditContentEn] = useState<string>("");
  const [editContentAr, setEditContentAr] = useState<string>("");

  // جلب جميع الأغراض عند تحميل المكون
  useEffect(() => {
    axiosServices
      .get("/api/soppurpose/getAllSop-Purpose")
      .then((res) => {
        setPurposes(res.data);
      })
      .catch((error) => console.error("Error fetching purposes:", error));
  }, []);

  // عند النقر المزدوج على صف في الجدول
  const handleDoubleClick = (id: string) => {
    axiosServices
      .get(`/api/soppurpose/getSop-Purpose/${id}`)
      .then((res) => {
        setSelectedPurpose(res.data);
        setEditContentEn(res.data.Content_en);
        setEditContentAr(res.data.Content_ar);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching purpose:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPurpose(null);
  };

  // حفظ التعديل
  const handleSave = () => {
    if (!selectedPurpose) return;

    axiosServices
      .put(`/api/soppurpose/updateSop-Purpose/${selectedPurpose.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
      })
      .then((res) => {
        // تحديث القائمة
        setPurposes((prev) =>
          prev.map((pur) => (pur.Id === selectedPurpose.Id ? res.data : pur))
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating purpose:", error));
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h6" gutterBottom>
        1. Purpose:
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
            {purposes.map((pur) => (
              <TableRow
                key={pur.Id}
                onDoubleClick={() => handleDoubleClick(pur.Id)}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{pur.Content_en}</TableCell>
                <TableCell align="right" sx={{ direction: "rtl" }}>
                  {pur.Content_ar}
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
        <DialogTitle>تفاصيل الغرض</DialogTitle>
        <DialogContent dividers>
          {selectedPurpose && (
            <Box>
              {/* عرض المعلومات */}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Id:</strong> {selectedPurpose.Id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Version:</strong> {selectedPurpose.Version}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Crt_Date:</strong> {selectedPurpose.Crt_Date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modified_Date:</strong>{" "}
                {selectedPurpose.Modified_Date || "N/A"}
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

              {/* سجل التعديلات إن وجد */}
              {selectedPurpose.modificationLog && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">سجل التعديلات:</Typography>
                  <List>
                    {selectedPurpose.modificationLog.map((log, index) => (
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

export default PurposeSection;

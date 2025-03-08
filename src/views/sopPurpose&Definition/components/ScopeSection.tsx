// src/components/ScopeSection.tsx

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

interface Scope {
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

const ScopeSection: React.FC = () => {
  const [scopeList, setScopeList] = useState<Scope[]>([]);
  const [selectedScope, setSelectedScope] = useState<Scope | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // الحقول التي سيتم التعديل عليها
  const [editContentEn, setEditContentEn] = useState<string>("");
  const [editContentAr, setEditContentAr] = useState<string>("");

  // جلب بيانات الـ Scope عند تحميل المكون
  useEffect(() => {
    axiosServices
      .get("/api/sopScope/getAllSop-Scope")
      .then((res) => {
        setScopeList(res.data);
      })
      .catch((error) => console.error("Error fetching scope data:", error));
  }, []);

  // عند النقر المزدوج على صف
  const handleDoubleClick = (id: string) => {
    axiosServices
      .get(`/api/sopScope/getSop-Scope/${id}`)
      .then((res) => {
        setSelectedScope(res.data);
        setEditContentEn(res.data.Content_en);
        setEditContentAr(res.data.Content_ar);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching scope item:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScope(null);
  };

  // حفظ التعديل
  const handleSave = () => {
    if (!selectedScope) return;

    axiosServices
      .put(`/api/sopScope/updateSop-Scope/${selectedScope.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
      })
      .then((res) => {
        // تحديث القائمة
        setScopeList((prev) =>
          prev.map((item) => (item.Id === selectedScope.Id ? res.data : item))
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating scope:", error));
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h6" gutterBottom>
        3. Scope:
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }}>
                English Content
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "50%" }}
                align="right"
              >
                المحتوى العربي
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scopeList.map((item) => (
              <TableRow
                key={item.Id}
                onDoubleClick={() => handleDoubleClick(item.Id)}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{item.Content_en}</TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  {item.Content_ar}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog للتعديل */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>تفاصيل الـ Scope</DialogTitle>
        <DialogContent dividers>
          {selectedScope && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Id:</strong> {selectedScope.Id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Version:</strong> {selectedScope.Version}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Crt_Date:</strong> {selectedScope.Crt_Date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modified_Date:</strong>{" "}
                {selectedScope.Modified_Date || "N/A"}
              </Typography>

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
                  inputProps={{
                    style: { textAlign: "right", direction: "rtl" },
                  }}
                />
              </Stack>

              {selectedScope.modificationLog && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">سجل التعديلات:</Typography>
                  <List>
                    {selectedScope.modificationLog.map((log, index) => (
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

export default ScopeSection;

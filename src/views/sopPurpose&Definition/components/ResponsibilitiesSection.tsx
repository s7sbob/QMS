// src/components/ResponsibilitiesSection.tsx

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

interface Responsibility {
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

const ResponsibilitiesSection: React.FC = () => {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [selectedResp, setSelectedResp] = useState<Responsibility | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [editContentEn, setEditContentEn] = useState<string>("");
  const [editContentAr, setEditContentAr] = useState<string>("");

  useEffect(() => {
    axiosServices
      .get("/api/sopRes/getAllSop-Res")
      .then((res) => {
        setResponsibilities(res.data);
      })
      .catch((error) => console.error("Error fetching responsibilities:", error));
  }, []);

  const handleDoubleClick = (id: string) => {
    axiosServices
      .get(`/api/sopRes/getSop-Res/${id}`)
      .then((res) => {
        setSelectedResp(res.data);
        setEditContentEn(res.data.Content_en);
        setEditContentAr(res.data.Content_ar);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching responsibility:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResp(null);
  };

  const handleSave = () => {
    if (!selectedResp) return;

    axiosServices
      .put(`/api/sopRes/updateSop-Res/${selectedResp.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
      })
      .then((res) => {
        // تحديث القائمة
        setResponsibilities((prev) =>
          prev.map((r) => (r.Id === selectedResp.Id ? res.data : r))
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating responsibility:", error));
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h6" gutterBottom>
        5. Responsibilities:
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
            {responsibilities.map((resp) => (
              <TableRow
                key={resp.Id}
                onDoubleClick={() => handleDoubleClick(resp.Id)}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{resp.Content_en}</TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>
                  {resp.Content_ar}
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
        <DialogTitle>تفاصيل المسؤولية</DialogTitle>
        <DialogContent dividers>
          {selectedResp && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Id:</strong> {selectedResp.Id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Version:</strong> {selectedResp.Version}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Crt_Date:</strong> {selectedResp.Crt_Date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modified_Date:</strong>{" "}
                {selectedResp.Modified_Date || "N/A"}
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

              {selectedResp.modificationLog && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">سجل التعديلات:</Typography>
                  <List>
                    {selectedResp.modificationLog.map((log, index) => (
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

export default ResponsibilitiesSection;

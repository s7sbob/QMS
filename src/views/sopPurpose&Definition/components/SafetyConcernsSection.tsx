// src/components/SafetyConcernsSection.tsx

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

interface SafetyConcern {
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

const SafetyConcernsSection: React.FC = () => {
  const [safetyConcerns, setSafetyConcerns] = useState<SafetyConcern[]>([]);
  const [selectedItem, setSelectedItem] = useState<SafetyConcern | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // حقول التعديل
  const [editContentEn, setEditContentEn] = useState<string>("");
  const [editContentAr, setEditContentAr] = useState<string>("");

  useEffect(() => {
    axiosServices
      .get("/api/sopSafetyConcerns/getAllSop-SafetyConcerns")
      .then((res) => {
        setSafetyConcerns(res.data);
      })
      .catch((error) =>
        console.error("Error fetching safety concerns:", error)
      );
  }, []);

  const handleDoubleClick = (id: string) => {
    axiosServices
      .get(`/api/sopSafetyConcerns/getSop-SafetyConcerns/${id}`)
      .then((res) => {
        setSelectedItem(res.data);
        setEditContentEn(res.data.Content_en);
        setEditContentAr(res.data.Content_ar);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching item:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (!selectedItem) return;

    axiosServices
      .put(`/api/sopSafetyConcerns/updateSop-SafetyConcerns/${selectedItem.Id}`, {
        Content_en: editContentEn,
        Content_ar: editContentAr,
      })
      .then((res) => {
        // تحديث القائمة
        setSafetyConcerns((prev) =>
          prev.map((i) => (i.Id === selectedItem.Id ? res.data : i))
        );
        handleCloseDialog();
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h6" gutterBottom>
        6. Safety Concerns:
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
            {safetyConcerns.map((item) => (
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
        <DialogTitle>تفاصيل الـ Safety Concerns</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Id:</strong> {selectedItem.Id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Version:</strong> {selectedItem.Version}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Crt_Date:</strong> {selectedItem.Crt_Date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modified_Date:</strong>{" "}
                {selectedItem.Modified_Date || "N/A"}
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

              {selectedItem.modificationLog && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">سجل التعديلات:</Typography>
                  <List>
                    {selectedItem.modificationLog.map((log, index) => (
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

export default SafetyConcernsSection;

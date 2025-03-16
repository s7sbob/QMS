import React, { useEffect, useState } from "react";
import axiosServices from "src/utils/axiosServices";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

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
  const [editContentEn, setEditContentEn] = useState("");
  const [editContentAr, setEditContentAr] = useState("");
  const [editReviewerComment, setEditReviewerComment] = useState("");
  const [historicalProcedures, setHistoricalProcedures] = useState<Procedure[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProcedure(initialData);
      setEditContentEn(initialData.Content_en);
      setEditContentAr(initialData.Content_ar);
      setEditReviewerComment(initialData.reviewer_Comment || "");
    }
  }, [initialData]);

  const hasComment = Boolean(editReviewerComment.trim());

  const handleDoubleClick = () => {
    if (!procedure) return;
    axiosServices
      .get(`/api/sopprocedures/getAllHistory/${procedure.Sop_HeaderId}`)
      .then((res) => {
        const activeRecords = res.data.filter((item: any) => item.Is_Active === 0);
        setHistoricalProcedures(activeRecords);
        setOpenDialog(true);
      })
      .catch((error) => console.error("Error fetching historical procedures:", error));
  };

  const handleSave = () => {
    if (!procedure) return;
    if (editContentEn !== procedure.Content_en || editContentAr !== procedure.Content_ar) {
      // Insert call
      axiosServices
        .post("/api/soprocedures/addSop-Procedure", {
          Content_en: editContentEn,
          Content_ar: editContentAr,
          reviewer_Comment: editReviewerComment,
          Sop_HeaderId: procedure.Sop_HeaderId,
        })
        .then((res) => {
          setProcedure(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error inserting procedure:", error));
    } else {
      // Update call (only reviewer comment changed)
      axiosServices
        .post(`/api/soprocedures/updateSop-Procedure/${procedure.Id}`, {
          Content_en: editContentEn,
          Content_ar: editContentAr,
          reviewer_Comment: editReviewerComment,
        })
        .then((res) => {
          setProcedure(res.data);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating procedure:", error));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ mt: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: hasComment ? "red" : "inherit",
        }}
      >
        <span>4. Procedures:</span>
        <span>(الإجراءات)</span>
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }}>English Content</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "50%" }} align="right">المحتوى العربي</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {procedure && (
              <TableRow onDoubleClick={handleDoubleClick} hover sx={{ cursor: "pointer" }}>
                <TableCell>{procedure.Content_en}</TableCell>
                <TableCell align="right" style={{ direction: "rtl" }}>{procedure.Content_ar}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>تفاصيل الإجراءات</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Current Record</Typography>
          {procedure && (
            <Box sx={{ mb: 2, border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
              <Stack spacing={2}>
                <TextField label="English Content" multiline minRows={2} value={editContentEn} onChange={(e) => setEditContentEn(e.target.value)} />
                <TextField label="Arabic Content" multiline minRows={2} value={editContentAr} onChange={(e) => setEditContentAr(e.target.value)} inputProps={{ style: { textAlign: "right", direction: "rtl" } }} />
                <TextField label="Reviewer Comment" multiline minRows={1} value={editReviewerComment} onChange={(e) => setEditReviewerComment(e.target.value)} InputProps={{ style: { color: "red" } }} />
                <Typography variant="body2"><strong>Version:</strong> {procedure.Version}</Typography>
                <Typography variant="body2"><strong>Crt_Date:</strong> {procedure.Crt_Date}</Typography>
                <Typography variant="body2"><strong>Modified_Date:</strong> {procedure.Modified_Date || "N/A"}</Typography>
                <Typography variant="body2"><strong>Crt_by:</strong> {procedure.Crt_by}</Typography>
                <Typography variant="body2"><strong>Modified_by:</strong> {procedure.Modified_by || "N/A"}</Typography>
              </Stack>
            </Box>
          )}
          <Typography variant="h6" gutterBottom>History (read-only)</Typography>
          {historicalProcedures.length > 0 ? (
            <List>
              {historicalProcedures.map((record) => (
                <ListItem key={record.Id} alignItems="flex-start">
                  <Box>
                    <Typography variant="body2"><strong>Content (EN):</strong> {record.Content_en}</Typography>
                    <Typography variant="body2"><strong>Content (AR):</strong> {record.Content_ar}</Typography>
                    <Typography variant="body2"><strong>Version:</strong> {record.Version}</Typography>
                    <Typography variant="body2"><strong>Crt_Date:</strong> {record.Crt_Date}</Typography>
                    <Typography variant="body2"><strong>Modified_Date:</strong> {record.Modified_Date || "N/A"}</Typography>
                    <Typography variant="body2"><strong>Crt_by:</strong> {record.Crt_by}</Typography>
                    <Typography variant="body2"><strong>Modified_by:</strong> {record.Modified_by || "N/A"}</Typography>
                    {record.reviewer_Comment && (
                      <Typography variant="body2" sx={{ color: "red" }}>
                        <strong>Reviewer Comment:</strong> {record.reviewer_Comment}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No historical records available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save Current Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProceduresSection;

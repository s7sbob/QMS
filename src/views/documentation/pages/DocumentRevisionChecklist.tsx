// src/pages/DocumentRevisionChecklist.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  Box,
} from '@mui/material';

interface ChecklistItem {
  id: number;
  item: string;
  comply: string;
  comment: string;
}

const initialChecklist: ChecklistItem[] = [
  { id: 1, item: 'Document template and font format', comply: 'Yes', comment: '' },
  { id: 2, item: 'Does the document contain all items?', comply: 'Yes', comment: '' },
  // ... إلخ (تابع بقية العناصر)
  {
    id: 24,
    item: 'Are all changes in the previous version mentioned in the change history?',
    comply: 'Yes',
    comment: '',
  },
];

interface FormData {
  documentName: string;
  documentVersion: string;
  revisionDate: string;
  department: string;
  revisedBy: string;
  approvedBy: string;
}

const DocumentRevisionChecklist: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    documentName: '',
    documentVersion: '',
    revisionDate: '',
    department: '',
    revisedBy: '',
    approvedBy: '',
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChecklistChange = (id: number, field: 'comply' | 'comment', value: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // أرسل البيانات إلى Endpoint وهمي مثلاً
      // await axiosServices.post('/api/documentRevisionChecklist', {
      //   ...formData,
      //   checklist
      // });
      console.log('Data submitted:', { ...formData, checklist });
      alert('تم إرسال النموذج بنجاح (هذا مثال توضيحي)!');
    } catch (error) {
      console.error(error);
      alert('فشل الإرسال، راجع الـ Console لمعرفة التفاصيل.');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Document Revision Checklist
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form id="revisionChecklist" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Name"
                name="documentName"
                value={formData.documentName}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Version"
                name="documentVersion"
                value={formData.documentVersion}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Revision Date"
                name="revisionDate"
                value={formData.revisionDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item To Be Checked</TableCell>
                  <TableCell>Comply</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checklist.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-label-${row.id}`}>Select</InputLabel>
                        <Select
                          labelId={`select-label-${row.id}`}
                          value={row.comply}
                          label="Select"
                          onChange={(e) => handleChecklistChange(row.id, 'comply', e.target.value)}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="NA">N/A</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Comment"
                        value={row.comment}
                        onChange={(e) => handleChecklistChange(row.id, 'comment', e.target.value)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Revised By"
                name="revisedBy"
                value={formData.revisedBy}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Approved By QA Manager"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => window.print()}>
              Print
            </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DocumentRevisionChecklist;

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
  Box
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
  { id: 3, item: 'Is the document title describing sufficiently the purpose?', comply: 'Yes', comment: '' },
  { id: 4, item: 'Is the document type right?', comply: 'Yes', comment: '' },
  { id: 5, item: 'Is the document code right? (CCP)', comply: 'Yes', comment: '' },
  { id: 6, item: 'Is the document version right? (CCP)', comply: 'Yes', comment: '' },
  { id: 7, item: 'Issue Date, Effective Date and Revision Date', comply: 'Yes', comment: '' },
  { id: 8, item: 'Is the effective period right?', comply: 'Yes', comment: '' },
  { id: 9, item: 'Page numbering (CCP)', comply: 'Yes', comment: '' },
  { id: 10, item: 'Updating of table of contents (CCP)', comply: 'Yes', comment: '' },
  { id: 11, item: 'Is the purpose appropriate for this document?', comply: 'Yes', comment: '' },
  { id: 12, item: 'Are all definitions and abbreviations clearly defined?', comply: 'Yes', comment: '' },
  { id: 13, item: 'Is the scope appropriate for this document?', comply: 'Yes', comment: '' },
  { id: 14, item: 'Are the responsibilities clearly determined?', comply: 'Yes', comment: '' },
  { id: 15, item: 'Are the safety concerns sufficient?', comply: 'Yes', comment: '' },
  { id: 16, item: 'Is the procedure clear and understandable for implementation?', comply: 'Yes', comment: '' },
  { id: 17, item: 'Are the procedure points written in a logical manner, using unambiguous language and easy to follow?', comply: 'Yes', comment: '' },
  { id: 18, item: 'Is the numbering system of titles, subtitles, and points (CCP)', comply: 'Yes', comment: '' },
  { id: 19, item: 'Are the critical control points sufficient?', comply: 'Yes', comment: '' },
  { id: 20, item: 'Are all attachments included in this document?', comply: 'Yes', comment: '' },
  { id: 21, item: 'Are all forms coded correctly? (CCP)', comply: 'Yes', comment: '' },
  { id: 22, item: 'Do all forms contain the required data and are they clear to use?', comply: 'Yes', comment: '' },
  { id: 23, item: 'Review of references', comply: 'Yes', comment: '' },
  { id: 24, item: 'Are all changes in the previous version mentioned in the change history?', comply: 'Yes', comment: '' }
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
    approvedBy: ''
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChecklistChange = (
    id: number,
    field: 'comply' | 'comment',
    value: string
  ) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // هنا يمكنك إرسال البيانات إلى الـ API الخاص بالـ backend
    console.log('Form Data:', formData);
    console.log('Checklist:', checklist);
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

          {/* Checklist Table */}
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
                {checklist.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-label-${row.id}`}>Select</InputLabel>
                        <Select
                          labelId={`select-label-${row.id}`}
                          value={row.comply}
                          label="Select"
                          onChange={e =>
                            handleChecklistChange(row.id, 'comply', e.target.value as string)
                          }
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="NA">NA</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Comment"
                        value={row.comment}
                        onChange={e => handleChecklistChange(row.id, 'comment', e.target.value)}
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

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from '@mui/material';

/* إذا احتجت لاحقاً ربط البيانات  */
interface RequestedBy {
  name: string;
  designation: string;
  signature: string;
  date: string;
}
interface FormState {
  requestedCode: string;
  department: string;
  date: string;
  docTitle: string;
  purpose: string;
  scope: string;
  requested: RequestedBy;
  reviewed: RequestedBy;
  qaComment: string;
  docType: string;
  mergeExisting: boolean;
  mergeCode: string;
  qaNew: boolean;
  qaNewCode: string;
  qaManager: RequestedBy;
  docOfficer: RequestedBy;
}

const initialState: FormState = {
  requestedCode: '',
  department: '',
  date: '',
  docTitle: '',
  purpose: '',
  scope: '',
  requested: { name: '', designation: '', signature: '', date: '' },
  reviewed: { name: '', designation: '', signature: '', date: '' },
  qaComment: '',
  docType: '',
  mergeExisting: false,
  mergeCode: '',
  qaNew: false,
  qaNewCode: '',
  qaManager: { name: '', designation: '', signature: '', date: '' },
  docOfficer: { name: '', designation: '', signature: '', date: '' },
};

const NewDocumentRequestForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleNested =
    (parent: 'requested' | 'reviewed' | 'qaManager' | 'docOfficer', key: keyof RequestedBy) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: e.target.value },
      }));

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* ـــــ العنوان الرئيسي ـــــ */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">New Document Request Form</Typography>
        </Box>

        {/* ـــــ بيانات الرأس ـــــ */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Requested Code"
              variant="standard"
              value={form.requestedCode}
              onChange={handleChange('requestedCode')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Department"
              variant="standard"
              value={form.department}
              onChange={handleChange('department')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={handleChange('date')}
            />
          </Grid>
        </Grid>

        {/* ـــــ بيانات المستند ـــــ */}
        <TextField
          fullWidth
          label="Document Title"
          variant="standard"
          value={form.docTitle}
          onChange={handleChange('docTitle')}
          sx={{ mb: 2 }}
        />

        <Typography fontWeight="bold">Purpose:</Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="standard"
          value={form.purpose}
          onChange={handleChange('purpose')}
          sx={{ mb: 2 }}
        />

        <Typography fontWeight="bold">Scope:</Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="standard"
          value={form.scope}
          onChange={handleChange('scope')}
          sx={{ mb: 2 }}
        />

        {/* ـــــ جدول التواقيع ـــــ */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={2}
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}
                >
                  Requested By
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}
                >
                  Reviewed By
                </TableCell>
              </TableRow>
              {['Name', 'Designation', 'Signature', 'Date'].map((label) => (
                <TableRow key={label}>
                  <TableCell colSpan={2}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={label}
                      value={(form.requested as any)[label.toLowerCase()]}
                      onChange={handleNested('requested', label.toLowerCase() as any)}
                    />
                  </TableCell>
                  <TableCell colSpan={2}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={
                        label === 'Designation' ? `${label} / Department Manager` : label
                      }
                      value={(form.reviewed as any)[label.toLowerCase()]}
                      onChange={handleNested('reviewed', label.toLowerCase() as any)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ـــــ QA Manager Comments ـــــ */}
        <Typography fontWeight="bold">QA Manager:</Typography>
        <Typography>- Comment / Decision:</Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="standard"
          value={form.qaComment}
          onChange={handleChange('qaComment')}
          sx={{ mb: 2 }}
        />

        <Typography>- Type of Document:</Typography>
        <TextField
          fullWidth
          variant="standard"
          value={form.docType}
          onChange={handleChange('docType')}
          sx={{ mb: 1 }}
        />

        {/* ـــــ Merge / New ـــــ */}
        <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">
          <Checkbox
            checked={form.mergeExisting}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mergeExisting: e.target.checked }))
            }
          />
          <Typography>Merge with existing document code</Typography>
          <TextField
            variant="standard"
            size="small"
            value={form.mergeCode}
            onChange={handleChange('mergeCode')}
          />
          <Checkbox
            checked={form.qaNew}
            onChange={(e) => setForm((prev) => ({ ...prev, qaNew: e.target.checked }))}
          />
          <Typography>New</Typography>
        </Box>

        {/* ـــــ QA Document Officer ـــــ */}
        <Typography fontWeight="bold">QA Document Officer:</Typography>
        <Typography>- New Document Code:</Typography>
        <TextField
          fullWidth
          variant="standard"
          value={form.qaNewCode}
          onChange={handleChange('qaNewCode')}
          sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}
                >
                  QA Manager Approval
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}
                >
                  QA Document Officer
                </TableCell>
              </TableRow>
              {['Name', 'Signature', 'Date'].map((label) => (
                <TableRow key={label}>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={label}
                      value={(form.qaManager as any)[label.toLowerCase()]}
                      onChange={handleNested('qaManager', label.toLowerCase() as any)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={label}
                      value={(form.docOfficer as any)[label.toLowerCase()]}
                      onChange={handleNested('docOfficer', label.toLowerCase() as any)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default NewDocumentRequestForm;

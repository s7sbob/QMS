// src/pages/DistributionForm.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box
} from '@mui/material';

interface CopyDetail {
  copyNumber: string;
  receivedBy: string;
  receivedSign: string;
}

interface FormData {
  documentType: string;
  documentCode: string;
  documentTitle: string;
  version: string;
  issueDate: string;
  revisionDate: string;
  numberOfCopies: string; // نستخدم string هنا لاستقبال قيمة المدخل من الحقل
  destruction: string;
  copies: CopyDetail[];
}

const DistributionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    documentCode: '',
    documentTitle: '',
    version: '',
    issueDate: '',
    revisionDate: '',
    numberOfCopies: '',
    destruction: '',
    copies: [{ copyNumber: '', receivedBy: '', receivedSign: '' }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyChange = (
    index: number,
    field: keyof CopyDetail,
    value: string
  ) => {
    const updatedCopies = [...formData.copies];
    updatedCopies[index] = { ...updatedCopies[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      copies: updatedCopies,
    }));
  };

  const addCopyDetail = () => {
    setFormData(prev => ({
      ...prev,
      copies: [...prev.copies, { copyNumber: '', receivedBy: '', receivedSign: '' }],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // هنا يمكنك ربط البيانات مع الـ API الخاص بالـ backend
    console.log('Distribution Form Data:', formData);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Distribution Form
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Document Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Type"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              />
            </Grid>
            {/* Document Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Code"
                name="documentCode"
                value={formData.documentCode}
                onChange={handleChange}
              />
            </Grid>
            {/* Document Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Title"
                name="documentTitle"
                value={formData.documentTitle}
                onChange={handleChange}
              />
            </Grid>
            {/* Version */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Version #"
                name="version"
                value={formData.version}
                onChange={handleChange}
              />
            </Grid>
            {/* Issue Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Issue Date"
                name="issueDate"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={handleChange}
              />
            </Grid>
            {/* Revision Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Revision Date"
                name="revisionDate"
                InputLabelProps={{ shrink: true }}
                value={formData.revisionDate}
                onChange={handleChange}
              />
            </Grid>
            {/* عنوان القسم الخاص بتوزيع النسخ */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Department - Approved Copies Distribution
              </Typography>
            </Grid>
            {/* Initial No. of Copies */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Initial No. of Copies"
                name="numberOfCopies"
                inputProps={{ min: 1 }}
                value={formData.numberOfCopies}
                onChange={handleChange}
              />
            </Grid>
            {/* Dynamic Copies Container */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Copy Details:
              </Typography>
              {formData.copies.map((copy, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexWrap: 'wrap'
                  }}
                >
                  <TextField
                    label="Copy #"
                    required
                    value={copy.copyNumber}
                    onChange={e => handleCopyChange(index, 'copyNumber', e.target.value)}
                  />
                  <TextField
                    label="Received By (Name)"
                    required
                    value={copy.receivedBy}
                    onChange={e => handleCopyChange(index, 'receivedBy', e.target.value)}
                  />
                  <TextField
                    label="Sign/Date"
                    required
                    value={copy.receivedSign}
                    onChange={e => handleCopyChange(index, 'receivedSign', e.target.value)}
                  />
                </Box>
              ))}
              <Button variant="outlined" onClick={addCopyDetail}>
                Add Another Copy
              </Button>
            </Grid>
            {/* Destruction When Obsoletes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Destruction When Obsoletes (QA Signature/Date)"
                name="destruction"
                value={formData.destruction}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DistributionForm;

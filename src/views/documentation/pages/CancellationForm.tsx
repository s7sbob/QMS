// src/pages/CancellationForm.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
} from '@mui/material';

interface FormData {
  date: string;
  requestedSection: string;
  documentTitle: string;
  documentCode: string;
  revision: string;
  issueDate: string;
  reasons: string[];
  changeReason: string;
  changeDescription: string;
  suggestedDate: string;
  requestedByName: string;
  sectionManagerName: string;
  qualityManagerDecision: string;
}

const initialData: FormData = {
  date: '',
  requestedSection: '',
  documentTitle: '',
  documentCode: '',
  revision: '',
  issueDate: '',
  reasons: [],
  changeReason: '',
  changeDescription: '',
  suggestedDate: '',
  requestedByName: '',
  sectionManagerName: '',
  qualityManagerDecision: '',
};

const reasonsOptions = [
  'Periodic review',
  'Updating of procedure',
  'Audit response',
  'Add/Remove form',
  'Regulation Request',
  'Merged with another document',
  'Other',
];

const CancellationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (reason: string) => {
    setFormData((prev) => {
      const currentReasons = prev.reasons;
      if (currentReasons.includes(reason)) {
        return { ...prev, reasons: currentReasons.filter((r) => r !== reason) };
      } else {
        return { ...prev, reasons: [...currentReasons, reason] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Endpoint وهمي
      // await axiosServices.post('/api/cancellation-request', formData);
      console.log('Cancellation Form Data:', formData);
      alert('تم إرسال طلب التغيير/الإلغاء بنجاح (مثال وهمي)!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Change / Cancellation Request
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Requested Section"
                name="requestedSection"
                value={formData.requestedSection}
                onChange={handleChange}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Code#"
                name="documentCode"
                value={formData.documentCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Current Revision #"
                name="revision"
                value={formData.revision}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Current Issue Date"
                name="issueDate"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Reason for Change/Cancellation:
              </Typography>
              <FormGroup row>
                {reasonsOptions.map((reason) => (
                  <FormControlLabel
                    key={reason}
                    control={
                      <Checkbox
                        checked={formData.reasons.includes(reason)}
                        onChange={() => handleCheckboxChange(reason)}
                        name="reason"
                        value={reason}
                      />
                    }
                    label={reason}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Change / Cancellation Reason"
                name="changeReason"
                multiline
                rows={3}
                value={formData.changeReason}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Description of Change"
                name="changeDescription"
                multiline
                rows={3}
                value={formData.changeDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Suggested Date of Applying Changes"
                name="suggestedDate"
                InputLabelProps={{ shrink: true }}
                value={formData.suggestedDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Requested By (Name)"
                name="requestedByName"
                value={formData.requestedByName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Section Manager (Name)"
                name="sectionManagerName"
                value={formData.sectionManagerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Quality Assurance Manager Decision"
                name="qualityManagerDecision"
                multiline
                rows={3}
                value={formData.qualityManagerDecision}
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

export default CancellationForm;

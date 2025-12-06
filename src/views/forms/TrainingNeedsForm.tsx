import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Training Needs Form',
  },
];

interface TrainingNeedEntry {
  id: string;
  employeeName: string;
  department: string;
  position: string;
  trainingRequired: string;
  reasonForTraining: string;
  priority: string;
  targetCompletionDate: Date | null;
  remarks: string;
}

interface TrainingNeedsFormData {
  formNo: string;
  requestDate: Date | null;
  requestedBy: string;
  department: string;
  trainingNeedsEntries: TrainingNeedEntry[];
  reviewedBy: string;
  reviewDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
}

const TrainingNeedsForm: React.FC = () => {
  const [formData, setFormData] = useState<TrainingNeedsFormData>({
    formNo: '',
    requestDate: null,
    requestedBy: '',
    department: '',
    trainingNeedsEntries: [
      {
        id: '1',
        employeeName: '',
        department: '',
        position: '',
        trainingRequired: '',
        reasonForTraining: '',
        priority: 'Medium',
        targetCompletionDate: null,
        remarks: ''
      }
    ],
    reviewedBy: '',
    reviewDate: null,
    approvedBy: '',
    approvalDate: null,
  });

  const handleInputChange = (field: keyof TrainingNeedsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.trainingNeedsEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      trainingNeedsEntries: updatedEntries
    }));
  };

  const addEntry = () => {
    const newEntry: TrainingNeedEntry = {
      id: (formData.trainingNeedsEntries.length + 1).toString(),
      employeeName: '',
      department: '',
      position: '',
      trainingRequired: '',
      reasonForTraining: '',
      priority: 'Medium',
      targetCompletionDate: null,
      remarks: ''
    };
    setFormData(prev => ({
      ...prev,
      trainingNeedsEntries: [...prev.trainingNeedsEntries, newEntry]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.trainingNeedsEntries.length > 1) {
      const updatedEntries = formData.trainingNeedsEntries.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        trainingNeedsEntries: updatedEntries
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Handle form submission logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer title="Training Needs Form" description="Form for identifying and documenting training needs">
      <Breadcrumb title="Training Needs Form" items={BCrumb} />
      
      <ParentCard title="Training Needs Form">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="formNo">Form No.</CustomFormLabel>
              <CustomTextField
                id="formNo"
                variant="outlined"
                fullWidth
                value={formData.formNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('formNo', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="requestDate">Request Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.requestDate}
                  onChange={(newValue) => handleInputChange('requestDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="requestedBy">Requested By</CustomFormLabel>
              <CustomTextField
                id="requestedBy"
                variant="outlined"
                fullWidth
                value={formData.requestedBy}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('requestedBy', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="department">Department</CustomFormLabel>
              <CustomTextField
                id="department"
                variant="outlined"
                fullWidth
                value={formData.department}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('department', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Training Needs Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Training Needs Details
                </Typography>
                <Button variant="outlined" onClick={addEntry}>
                  Add Training Need
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Training Required</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reason for Training</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Target Completion Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.trainingNeedsEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.employeeName}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'employeeName', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.department}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'department', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.position}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'position', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.trainingRequired}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'trainingRequired', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={entry.reasonForTraining}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'reasonForTraining', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={entry.priority}
                              onChange={(e) => handleEntryChange(index, 'priority', e.target.value)}
                            >
                              <MenuItem value="High">High</MenuItem>
                              <MenuItem value="Medium">Medium</MenuItem>
                              <MenuItem value="Low">Low</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.targetCompletionDate}
                              onChange={(newValue) => handleEntryChange(index, 'targetCompletionDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={entry.remarks}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'remarks', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => removeEntry(index)}
                            disabled={formData.trainingNeedsEntries.length === 1}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Review and Approval */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Review and Approval
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="reviewedBy">Reviewed By</CustomFormLabel>
                  <CustomTextField
                    id="reviewedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.reviewedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewedBy', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="reviewDate">Review Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.reviewDate}
                      onChange={(newValue) => handleInputChange('reviewDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="approvedBy">Approved By</CustomFormLabel>
                  <CustomTextField
                    id="approvedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.approvedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('approvedBy', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="approvalDate">Approval Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.approvalDate}
                      onChange={(newValue) => handleInputChange('approvalDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handlePrint}
            >
              Print
            </Button>
          </Stack>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default TrainingNeedsForm;


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
    title: 'Annual Training Plan',
  },
];

interface TrainingPlanEntry {
  id: string;
  trainingTopic: string;
  targetAudience: string;
  trainingMethod: string;
  trainer: string;
  plannedDate: Date | null;
  status: string;
  remarks: string;
}

interface AnnualTrainingPlanData {
  year: string;
  department: string;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  trainingPlanEntries: TrainingPlanEntry[];
}

const AnnualTrainingPlan: React.FC = () => {
  const [formData, setFormData] = useState<AnnualTrainingPlanData>({
    year: new Date().getFullYear().toString(),
    department: '',
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    trainingPlanEntries: [
      {
        id: '1',
        trainingTopic: '',
        targetAudience: '',
        trainingMethod: '',
        trainer: '',
        plannedDate: null,
        status: 'Planned',
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof AnnualTrainingPlanData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.trainingPlanEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      trainingPlanEntries: updatedEntries
    }));
  };

  const addEntry = () => {
    const newEntry: TrainingPlanEntry = {
      id: (formData.trainingPlanEntries.length + 1).toString(),
      trainingTopic: '',
      targetAudience: '',
      trainingMethod: '',
      trainer: '',
      plannedDate: null,
      status: 'Planned',
      remarks: ''
    };
    setFormData(prev => ({
      ...prev,
      trainingPlanEntries: [...prev.trainingPlanEntries, newEntry]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.trainingPlanEntries.length > 1) {
      const updatedEntries = formData.trainingPlanEntries.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        trainingPlanEntries: updatedEntries
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
    <PageContainer title="Annual Training Plan" description="Annual Training Plan for the organization">
      <Breadcrumb title="Annual Training Plan" items={BCrumb} />
      
      <ParentCard title="Annual Training Plan">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="year">Year</CustomFormLabel>
              <CustomTextField
                id="year"
                variant="outlined"
                fullWidth
                value={formData.year}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('year', e.target.value)}
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
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="preparedBy">Prepared By</CustomFormLabel>
              <CustomTextField
                id="preparedBy"
                variant="outlined"
                fullWidth
                value={formData.preparedBy}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('preparedBy', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="preparedDate">Prepared Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.preparedDate}
                  onChange={(newValue) => handleInputChange('preparedDate', newValue)}
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

          {/* Training Plan Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Training Plan Details
                </Typography>
                <Button variant="outlined" onClick={addEntry}>
                  Add Training
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Training Topic</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Target Audience</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Training Method</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trainer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Planned Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.trainingPlanEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.trainingTopic}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'trainingTopic', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.targetAudience}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'targetAudience', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={entry.trainingMethod}
                              onChange={(e) => handleEntryChange(index, 'trainingMethod', e.target.value)}
                            >
                              <MenuItem value="Classroom">Classroom</MenuItem>
                              <MenuItem value="Online">Online</MenuItem>
                              <MenuItem value="On-the-job">On-the-job</MenuItem>
                              <MenuItem value="Workshop">Workshop</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.trainer}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'trainer', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.plannedDate}
                              onChange={(newValue) => handleEntryChange(index, 'plannedDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={entry.status}
                              onChange={(e) => handleEntryChange(index, 'status', e.target.value)}
                            >
                              <MenuItem value="Planned">Planned</MenuItem>
                              <MenuItem value="In Progress">In Progress</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
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
                            disabled={formData.trainingPlanEntries.length === 1}
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

export default AnnualTrainingPlan;


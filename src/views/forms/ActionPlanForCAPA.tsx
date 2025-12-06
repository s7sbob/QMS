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
    title: 'Action Plan for CAPA',
  },
];

interface ActionPlanEntry {
  id: string;
  actionDescription: string;
  responsiblePerson: string;
  targetDate: Date | null;
  actualCompletionDate: Date | null;
  status: string;
  remarks: string;
}

interface ActionPlanForCAPAData {
  capaNo: string;
  ncrDeviationNo: string;
  problemDescription: string;
  rootCause: string;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  actionPlanEntries: ActionPlanEntry[];
}

const ActionPlanForCAPA: React.FC = () => {
  const [formData, setFormData] = useState<ActionPlanForCAPAData>({
    capaNo: '',
    ncrDeviationNo: '',
    problemDescription: '',
    rootCause: '',
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    actionPlanEntries: [
      {
        id: '1',
        actionDescription: '',
        responsiblePerson: '',
        targetDate: null,
        actualCompletionDate: null,
        status: 'Open',
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof ActionPlanForCAPAData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.actionPlanEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      actionPlanEntries: updatedEntries
    }));
  };

  const addEntry = () => {
    const newEntry: ActionPlanEntry = {
      id: (formData.actionPlanEntries.length + 1).toString(),
      actionDescription: '',
      responsiblePerson: '',
      targetDate: null,
      actualCompletionDate: null,
      status: 'Open',
      remarks: ''
    };
    setFormData(prev => ({
      ...prev,
      actionPlanEntries: [...prev.actionPlanEntries, newEntry]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.actionPlanEntries.length > 1) {
      const updatedEntries = formData.actionPlanEntries.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        actionPlanEntries: updatedEntries
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
    <PageContainer title="Action Plan for CAPA" description="Action Plan for Corrective and Preventive Actions">
      <Breadcrumb title="Action Plan for CAPA" items={BCrumb} />
      
      <ParentCard title="Action Plan for CAPA">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="capaNo">CAPA No.</CustomFormLabel>
              <CustomTextField
                id="capaNo"
                variant="outlined"
                fullWidth
                value={formData.capaNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('capaNo', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="ncrDeviationNo">NCR/Deviation No.</CustomFormLabel>
              <CustomTextField
                id="ncrDeviationNo"
                variant="outlined"
                fullWidth
                value={formData.ncrDeviationNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('ncrDeviationNo', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="problemDescription">Problem Description</CustomFormLabel>
              <CustomTextField
                id="problemDescription"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.problemDescription}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('problemDescription', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="rootCause">Root Cause</CustomFormLabel>
              <CustomTextField
                id="rootCause"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.rootCause}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('rootCause', e.target.value)}
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

          {/* Action Plan Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Action Plan Details
                </Typography>
                <Button variant="outlined" onClick={addEntry}>
                  Add Action
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Responsible Person</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Target Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actual Completion Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.actionPlanEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={entry.actionDescription}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'actionDescription', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.responsiblePerson}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'responsiblePerson', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.targetDate}
                              onChange={(newValue) => handleEntryChange(index, 'targetDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.actualCompletionDate}
                              onChange={(newValue) => handleEntryChange(index, 'actualCompletionDate', newValue)}
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
                              <MenuItem value="Open">Open</MenuItem>
                              <MenuItem value="In Progress">In Progress</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Closed">Closed</MenuItem>
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
                            disabled={formData.actionPlanEntries.length === 1}
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

export default ActionPlanForCAPA;


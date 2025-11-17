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
    title: 'Change Control Logbook',
  },
];

interface ChangeControlLogEntry {
  id: string;
  changeRequestNo: string;
  requestDate: Date | null;
  changeTitle: string;
  requestedBy: string;
  status: string;
  approvalDate: Date | null;
  implementationDate: Date | null;
  closureDate: Date | null;
  remarks: string;
}

interface ChangeControlLogbookData {
  year: string;
  department: string;
  entries: ChangeControlLogEntry[];
}

const ChangeControlLogbook: React.FC = () => {
  const [formData, setFormData] = useState<ChangeControlLogbookData>({
    year: new Date().getFullYear().toString(),
    department: '',
    entries: [
      {
        id: '1',
        changeRequestNo: '',
        requestDate: null,
        changeTitle: '',
        requestedBy: '',
        status: 'Pending',
        approvalDate: null,
        implementationDate: null,
        closureDate: null,
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof ChangeControlLogbookData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const addEntry = () => {
    const newEntry: ChangeControlLogEntry = {
      id: (formData.entries.length + 1).toString(),
      changeRequestNo: '',
      requestDate: null,
      changeTitle: '',
      requestedBy: '',
      status: 'Pending',
      approvalDate: null,
      implementationDate: null,
      closureDate: null,
      remarks: ''
    };
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.entries.length > 1) {
      const updatedEntries = formData.entries.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        entries: updatedEntries
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
    <PageContainer title="Change Control Logbook" description="Change Control Logbook for tracking all change requests">
      <Breadcrumb title="Change Control Logbook" items={BCrumb} />
      
      <ParentCard title="Change Control Logbook">
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
          </Grid>

          {/* Change Control Log Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Change Control Log Entries
                </Typography>
                <Button variant="outlined" onClick={addEntry}>
                  Add Entry
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Change Request No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Change Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Requested By</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Approval Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Implementation Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Closure Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.changeRequestNo}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'changeRequestNo', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.requestDate}
                              onChange={(newValue) => handleEntryChange(index, 'requestDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.changeTitle}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'changeTitle', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.requestedBy}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'requestedBy', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={entry.status}
                              onChange={(e) => handleEntryChange(index, 'status', e.target.value)}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                              <MenuItem value="Implemented">Implemented</MenuItem>
                              <MenuItem value="Closed">Closed</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.approvalDate}
                              onChange={(newValue) => handleEntryChange(index, 'approvalDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.implementationDate}
                              onChange={(newValue) => handleEntryChange(index, 'implementationDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.closureDate}
                              onChange={(newValue) => handleEntryChange(index, 'closureDate', newValue)}
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
                            disabled={formData.entries.length === 1}
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

export default ChangeControlLogbook;


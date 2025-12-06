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
  Paper
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
    title: 'Audit Logbook',
  },
];

interface AuditLogEntry {
  id: string;
  auditDate: Date | null;
  auditType: string;
  auditScope: string;
  auditeeDepartment: string;
  auditTeam: string;
  auditLeader: string;
  auditStatus: string;
  findingsCount: string;
  reportDate: Date | null;
  followUpDate: Date | null;
  remarks: string;
}

interface AuditLogbookData {
  year: string;
  department: string;
  entries: AuditLogEntry[];
}

const AuditLogbook: React.FC = () => {
  const [formData, setFormData] = useState<AuditLogbookData>({
    year: new Date().getFullYear().toString(),
    department: '',
    entries: [
      {
        id: '1',
        auditDate: null,
        auditType: '',
        auditScope: '',
        auditeeDepartment: '',
        auditTeam: '',
        auditLeader: '',
        auditStatus: '',
        findingsCount: '',
        reportDate: null,
        followUpDate: null,
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof AuditLogbookData, value: any) => {
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
    const newEntry: AuditLogEntry = {
      id: (formData.entries.length + 1).toString(),
      auditDate: null,
      auditType: '',
      auditScope: '',
      auditeeDepartment: '',
      auditTeam: '',
      auditLeader: '',
      auditStatus: '',
      findingsCount: '',
      reportDate: null,
      followUpDate: null,
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
    <PageContainer title="Audit Logbook" description="Audit Logbook for tracking all audit activities">
      <Breadcrumb title="Audit Logbook" items={BCrumb} />
      
      <ParentCard title="Audit Logbook">
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

          {/* Audit Log Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Audit Log Entries
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Audit Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Audit Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Audit Scope</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Auditee Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Audit Team</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Audit Leader</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Findings Count</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Report Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Follow-up Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.auditDate}
                              onChange={(newValue) => handleEntryChange(index, 'auditDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditType}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditType', e.target.value)}
                            placeholder="Internal/External"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditScope}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditScope', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditeeDepartment}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditeeDepartment', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditTeam}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditTeam', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditLeader}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditLeader', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.auditStatus}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'auditStatus', e.target.value)}
                            placeholder="Planned/In Progress/Completed"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={entry.findingsCount}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'findingsCount', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.reportDate}
                              onChange={(newValue) => handleEntryChange(index, 'reportDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.followUpDate}
                              onChange={(newValue) => handleEntryChange(index, 'followUpDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={entry.remarks}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'remarks', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
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

export default AuditLogbook;


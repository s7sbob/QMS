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
    title: 'Master Document List',
  },
];

interface DocumentEntry {
  id: string;
  documentNo: string;
  documentTitle: string;
  documentType: string;
  versionNo: string;
  effectiveDate: Date | null;
  reviewDate: Date | null;
  status: string;
  remarks: string;
}

interface MasterDocumentListData {
  department: string;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  entries: DocumentEntry[];
}

const MasterDocumentList: React.FC = () => {
  const [formData, setFormData] = useState<MasterDocumentListData>({
    department: '',
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    entries: [
      {
        id: '1',
        documentNo: '',
        documentTitle: '',
        documentType: '',
        versionNo: '',
        effectiveDate: null,
        reviewDate: null,
        status: 'Active',
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof MasterDocumentListData, value: any) => {
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
    const newEntry: DocumentEntry = {
      id: (formData.entries.length + 1).toString(),
      documentNo: '',
      documentTitle: '',
      documentType: '',
      versionNo: '',
      effectiveDate: null,
      reviewDate: null,
      status: 'Active',
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
    <PageContainer title="Master Document List" description="Master Document List for tracking all controlled documents">
      <Breadcrumb title="Master Document List" items={BCrumb} />
      
      <ParentCard title="Master Document List">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
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

          {/* Document Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Document Entries
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Document No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Document Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Document Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Version No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Review Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                            value={entry.documentNo}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'documentNo', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.documentTitle}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'documentTitle', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={entry.documentType}
                              onChange={(e) => handleEntryChange(index, 'documentType', e.target.value)}
                            >
                              <MenuItem value="SOP">SOP</MenuItem>
                              <MenuItem value="Form">Form</MenuItem>
                              <MenuItem value="Policy">Policy</MenuItem>
                              <MenuItem value="Guideline">Guideline</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={entry.versionNo}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'versionNo', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.effectiveDate}
                              onChange={(newValue) => handleEntryChange(index, 'effectiveDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={entry.reviewDate}
                              onChange={(newValue) => handleEntryChange(index, 'reviewDate', newValue)}
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
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Superseded">Superseded</MenuItem>
                              <MenuItem value="Obsolete">Obsolete</MenuItem>
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

export default MasterDocumentList;


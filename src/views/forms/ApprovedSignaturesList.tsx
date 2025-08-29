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
    title: 'Approved Signatures List',
  },
];

interface SignatureEntry {
  id: string;
  employeeName: string;
  department: string;
  position: string;
  signature: string;
  effectiveDate: Date | null;
  expiryDate: Date | null;
  status: string;
  remarks: string;
}

interface ApprovedSignaturesListData {
  listNo: string;
  issueDate: Date | null;
  revisionNo: string;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  entries: SignatureEntry[];
}

const ApprovedSignaturesList: React.FC = () => {
  const [formData, setFormData] = useState<ApprovedSignaturesListData>({
    listNo: '',
    issueDate: null,
    revisionNo: '',
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    entries: [
      {
        id: '1',
        employeeName: '',
        department: '',
        position: '',
        signature: '',
        effectiveDate: null,
        expiryDate: null,
        status: 'Active',
        remarks: ''
      }
    ]
  });

  const handleInputChange = (field: keyof ApprovedSignaturesListData, value: any) => {
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
    const newEntry: SignatureEntry = {
      id: (formData.entries.length + 1).toString(),
      employeeName: '',
      department: '',
      position: '',
      signature: '',
      effectiveDate: null,
      expiryDate: null,
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
    <PageContainer title="Approved Signatures List" description="Approved Signatures List for authorized personnel">
      <Breadcrumb title="Approved Signatures List" items={BCrumb} />
      
      <ParentCard title="Approved Signatures List">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="listNo">List No.</CustomFormLabel>
              <CustomTextField
                id="listNo"
                variant="outlined"
                fullWidth
                value={formData.listNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('listNo', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="issueDate">Issue Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.issueDate}
                  onChange={(newValue) => handleInputChange('issueDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="revisionNo">Revision No.</CustomFormLabel>
              <CustomTextField
                id="revisionNo"
                variant="outlined"
                fullWidth
                value={formData.revisionNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('revisionNo', e.target.value)}
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

          {/* Signature Entries */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Signature Entries
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
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
                            value={entry.signature}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(index, 'signature', e.target.value)}
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
                              value={entry.expiryDate}
                              onChange={(newValue) => handleEntryChange(index, 'expiryDate', newValue)}
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
                              <MenuItem value="Inactive">Inactive</MenuItem>
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

export default ApprovedSignaturesList;


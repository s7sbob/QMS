import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Customer Complaint Logbook',
  },
];

interface ComplaintLogEntry {
  id: string;
  complaintNumber: string;
  receivingDate: Date | null;
  complaintSource: string;
  productDescription: string;
  batchNumber: string;
  complaintDescription: string;
  actionsTaken: string;
  capaNumber: string;
  completionDate: Date | null;
}

interface ComplaintLogbookData {
  entries: ComplaintLogEntry[];
}

const CustomerComplaintLogbook: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintLogbookData>({
    entries: [
      {
        id: '1',
        complaintNumber: '',
        receivingDate: null,
        complaintSource: '',
        productDescription: '',
        batchNumber: '',
        complaintDescription: '',
        actionsTaken: '',
        capaNumber: '',
        completionDate: null,
      }
    ],
  });

  const handleEntryChange = (id: string, field: keyof ComplaintLogEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addEntry = () => {
    const newId = (formData.entries.length + 1).toString();
    const newEntry: ComplaintLogEntry = {
      id: newId,
      complaintNumber: '',
      receivingDate: null,
      complaintSource: '',
      productDescription: '',
      batchNumber: '',
      complaintDescription: '',
      actionsTaken: '',
      capaNumber: '',
      completionDate: null,
    };
    
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));
  };

  const removeEntry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  };

  const handleSubmit = () => {
    console.log('Customer Complaint Logbook Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="Customer Complaint Logbook" description="Healthcare Division Customer Complaint Logbook">
      <Breadcrumb title="Customer Complaint Logbook" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Customer Complaint Logbook">
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code #: QA-SOP-FRM-007.002/03
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Complaint Logbook Entries
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addEntry}
                  size="small"
                >
                  Add Entry
                </Button>
              </Box>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 120 }}>Complaint #</TableCell>
                        <TableCell sx={{ minWidth: 140 }}>Receiving Date</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Complaint Source</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Product Description</TableCell>
                        <TableCell sx={{ minWidth: 100 }}>Batch #</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Complaint Description (Briefly)</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Actions Taken</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>CAPA # (If Needed)</TableCell>
                        <TableCell sx={{ minWidth: 140 }}>Completion Date</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.complaintNumber}
                              onChange={(e) => handleEntryChange(entry.id, 'complaintNumber', e.target.value)}
                              placeholder="Enter complaint #"
                            />
                          </TableCell>
                          <TableCell>
                            <DatePicker
                              value={entry.receivingDate}
                              onChange={(newValue) => handleEntryChange(entry.id, 'receivingDate', newValue)}
                              inputFormat="MM/dd/yyyy"
                              renderInput={(params) => <CustomTextField {...params} size="small" variant="outlined" />}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.complaintSource}
                              onChange={(e) => handleEntryChange(entry.id, 'complaintSource', e.target.value)}
                              placeholder="Enter source"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.productDescription}
                              onChange={(e) => handleEntryChange(entry.id, 'productDescription', e.target.value)}
                              placeholder="Enter product description"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.batchNumber}
                              onChange={(e) => handleEntryChange(entry.id, 'batchNumber', e.target.value)}
                              placeholder="Enter batch #"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={2}
                              value={entry.complaintDescription}
                              onChange={(e) => handleEntryChange(entry.id, 'complaintDescription', e.target.value)}
                              placeholder="Enter complaint description"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={2}
                              value={entry.actionsTaken}
                              onChange={(e) => handleEntryChange(entry.id, 'actionsTaken', e.target.value)}
                              placeholder="Enter actions taken"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.capaNumber}
                              onChange={(e) => handleEntryChange(entry.id, 'capaNumber', e.target.value)}
                              placeholder="Enter CAPA #"
                            />
                          </TableCell>
                          <TableCell>
                            <DatePicker
                              value={entry.completionDate}
                              onChange={(newValue) => handleEntryChange(entry.id, 'completionDate', newValue)}
                              inputFormat="MM/dd/yyyy"
                              renderInput={(params) => <CustomTextField {...params} size="small" variant="outlined" />}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => removeEntry(entry.id)}
                              disabled={formData.entries.length === 1}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </LocalizationProvider>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              Save Logbook
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => setFormData({
                entries: [
                  {
                    id: '1',
                    complaintNumber: '',
                    receivingDate: null,
                    complaintSource: '',
                    productDescription: '',
                    batchNumber: '',
                    complaintDescription: '',
                    actionsTaken: '',
                    capaNumber: '',
                    completionDate: null,
                  }
                ],
              })}
            >
              Reset Logbook
            </Button>
          </Stack>

        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default CustomerComplaintLogbook;


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

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Customer Complaint Trend Analysis',
  },
];

interface TrendAnalysisEntry {
  id: string;
  serialNumber: string;
  complaintNumber: string;
  productName: string;
  supplierName: string;
  rootCause: string;
  classification: string;
  occurrence: string;
}

interface TrendAnalysisData {
  year: string;
  entries: TrendAnalysisEntry[];
}

const CustomerComplaintTrendAnalysis: React.FC = () => {
  const [formData, setFormData] = useState<TrendAnalysisData>({
    year: new Date().getFullYear().toString(),
    entries: [
      {
        id: '1',
        serialNumber: '1',
        complaintNumber: '',
        productName: '',
        supplierName: '',
        rootCause: '',
        classification: '',
        occurrence: '',
      }
    ],
  });

  const handleInputChange = (field: keyof TrendAnalysisData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (id: string, field: keyof TrendAnalysisEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addEntry = () => {
    const newId = (formData.entries.length + 1).toString();
    const newEntry: TrendAnalysisEntry = {
      id: newId,
      serialNumber: newId,
      complaintNumber: '',
      productName: '',
      supplierName: '',
      rootCause: '',
      classification: '',
      occurrence: '',
    };
    
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));
  };

  const removeEntry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id).map((entry, index) => ({
        ...entry,
        serialNumber: (index + 1).toString()
      }))
    }));
  };

  const handleSubmit = () => {
    console.log('Customer Complaint Trend Analysis Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="Customer Complaint Trend Analysis" description="Customer Complaint Trend Analysis">
      <Breadcrumb title="Customer Complaint Trend Analysis" items={BCrumb} />
      
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code #: QA-SOP-FRM-007.004/01
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="year">Year</CustomFormLabel>
              <CustomTextField
                id="year"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.year}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('year', e.target.value)}
              />
            </Grid>
          </Grid>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Trend Analysis Entries
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
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 80 }}>S. No</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>Complaint No</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>Product Name</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>Supplier Name</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Root Cause</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>Classification</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Occurrence</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {entry.serialNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.complaintNumber}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'complaintNumber', e.target.value)}
                            placeholder="Enter complaint no"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.productName}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'productName', e.target.value)}
                            placeholder="Enter product name"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.supplierName}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'supplierName', e.target.value)}
                            placeholder="Enter supplier name"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={2}
                            value={entry.rootCause}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'rootCause', e.target.value)}
                            placeholder="Enter root cause"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.classification}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'classification', e.target.value)}
                            placeholder="Enter classification"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.occurrence}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'occurrence', e.target.value)}
                            placeholder="Enter occurrence"
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
              Save Analysis
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => setFormData({
                year: new Date().getFullYear().toString(),
                entries: [
                  {
                    id: '1',
                    serialNumber: '1',
                    complaintNumber: '',
                    productName: '',
                    supplierName: '',
                    rootCause: '',
                    classification: '',
                    occurrence: '',
                  }
                ],
              })}
            >
              Reset Analysis
            </Button>
          </Stack>

        </Box>
    </PageContainer>
  );
};

export default CustomerComplaintTrendAnalysis;


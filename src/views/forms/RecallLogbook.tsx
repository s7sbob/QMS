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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Recall Logbook',
  },
];

interface RecallEntry {
  id: string;
  recallDate: Date | null;
  productName: string;
  supplierName: string;
  recallLevel: string;
  remarks: string;
  completionDate: Date | null;
}

interface RecallLogbookData {
  entries: RecallEntry[];
}

const RecallLogbook: React.FC = () => {
  const [formData, setFormData] = useState<RecallLogbookData>({
    entries: [
      {
        id: '1',
        recallDate: null,
        productName: '',
        supplierName: '',
        recallLevel: '',
        remarks: '',
        completionDate: null,
      }
    ],
  });

  const handleEntryChange = (id: string, field: keyof RecallEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addEntry = () => {
    const newId = (formData.entries.length + 1).toString();
    const newEntry: RecallEntry = {
      id: newId,
      recallDate: null,
      productName: '',
      supplierName: '',
      recallLevel: '',
      remarks: '',
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
    console.log('Recall Logbook Data:', formData);
    // Here you would typically send the data to your backend
  };

  const recallLevelOptions = [
    { value: 'level1', label: 'Level 1 - Consumer Level' },
    { value: 'level2', label: 'Level 2 - Retail Level' },
    { value: 'level3', label: 'Level 3 - Wholesale Level' },
  ];

  return (
    <PageContainer title="Recall Logbook" description="Healthcare Division Recall Logbook">
      <Breadcrumb title="Recall Logbook" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Recall Logbook">
        <Box component="form" sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    Recall Entries
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
                        <TableCell sx={{ minWidth: 150 }}>Recall Date</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Product Name</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Supplier Name</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Recall Level</TableCell>
                        <TableCell sx={{ minWidth: 250 }}>Remarks</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Completion Date</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <DateTimePicker
                              value={entry.recallDate}
                              onChange={(newValue) => handleEntryChange(entry.id, 'recallDate', newValue)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  variant: 'outlined',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.productName}
                              onChange={(e) => handleEntryChange(entry.id, 'productName', e.target.value)}
                              placeholder="Enter product name"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={entry.supplierName}
                              onChange={(e) => handleEntryChange(entry.id, 'supplierName', e.target.value)}
                              placeholder="Enter supplier name"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={entry.recallLevel}
                              onChange={(e) => handleEntryChange(entry.id, 'recallLevel', e.target.value)}
                              displayEmpty
                            >
                              <option value="">Select Level</option>
                              {recallLevelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={2}
                              value={entry.remarks}
                              onChange={(e) => handleEntryChange(entry.id, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </TableCell>
                          <TableCell>
                            <DateTimePicker
                              value={entry.completionDate}
                              onChange={(newValue) => handleEntryChange(entry.id, 'completionDate', newValue)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  variant: 'outlined',
                                },
                              }}
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
                      recallDate: null,
                      productName: '',
                      supplierName: '',
                      recallLevel: '',
                      remarks: '',
                      completionDate: null,
                    }
                  ],
                })}
              >
                Reset Logbook
              </Button>
            </Stack>

          </LocalizationProvider>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default RecallLogbook;


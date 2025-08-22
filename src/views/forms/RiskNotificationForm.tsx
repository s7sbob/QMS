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
  Stack,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
    title: 'Risk Notification Form',
  },
];

interface RiskNotificationEntry {
  id: string;
  riskNumber: string;
  riskDescription: string;
  riskClass: string;
  riskImpact: string;
  rpn: string;
  qaControl: boolean;
  operationControl: boolean;
  warehouseControl: boolean;
  deliveryControl: boolean;
  facilityControl: boolean;
}

interface RiskNotificationData {
  date: Date | null;
  department: string;
  process: string;
  riskAssessmentReportNo: string;
  entries: RiskNotificationEntry[];
  preparedByName: string;
  preparedBySignDate: string;
  reviewedByName: string;
  reviewedBySignDate: string;
  qaManagerName: string;
  qaManagerSignDate: string;
}

const RiskNotificationForm: React.FC = () => {
  const [formData, setFormData] = useState<RiskNotificationData>({
    date: null,
    department: '',
    process: '',
    riskAssessmentReportNo: '',
    entries: [
      {
        id: '1',
        riskNumber: '',
        riskDescription: '',
        riskClass: '',
        riskImpact: '',
        rpn: '',
        qaControl: false,
        operationControl: false,
        warehouseControl: false,
        deliveryControl: false,
        facilityControl: false,
      }
    ],
    preparedByName: '',
    preparedBySignDate: '',
    reviewedByName: '',
    reviewedBySignDate: '',
    qaManagerName: '',
    qaManagerSignDate: '',
  });

  const handleInputChange = (field: keyof RiskNotificationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (id: string, field: keyof RiskNotificationEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addEntry = () => {
    const newId = (formData.entries.length + 1).toString();
    const newEntry: RiskNotificationEntry = {
      id: newId,
      riskNumber: '',
      riskDescription: '',
      riskClass: '',
      riskImpact: '',
      rpn: '',
      qaControl: false,
      operationControl: false,
      warehouseControl: false,
      deliveryControl: false,
      facilityControl: false,
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

  const getRiskPriorityColor = (rpn: string) => {
    const rpnValue = parseInt(rpn);
    if (rpnValue >= 12 && rpnValue <= 27) return 'error'; // High Risk
    if (rpnValue >= 6 && rpnValue <= 9) return 'warning'; // Medium Risk
    if (rpnValue >= 1 && rpnValue <= 4) return 'success'; // Low Risk
    return 'default';
  };

  const getRiskPriorityLabel = (rpn: string) => {
    const rpnValue = parseInt(rpn);
    if (rpnValue >= 12 && rpnValue <= 27) return 'High Risk';
    if (rpnValue >= 6 && rpnValue <= 9) return 'Medium Risk';
    if (rpnValue >= 1 && rpnValue <= 4) return 'Low Risk';
    return 'Unknown';
  };

  const handleSubmit = () => {
    console.log('Risk Notification Form Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="Risk Notification Form" description="Healthcare Division Risk notification form">
      <Breadcrumb title="Risk Notification Form" items={BCrumb} />
      
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code#: QA-SOP-FRM-012.006/02
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="date">Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.date}
                  onChange={(newValue) => handleInputChange('date', newValue)}
                  inputFormat="MM/dd/yyyy"
                  renderInput={(params) => <CustomTextField {...params} variant="outlined" fullWidth />}
                />
              </LocalizationProvider>
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
              <CustomFormLabel htmlFor="process">Process</CustomFormLabel>
              <CustomTextField
                id="process"
                variant="outlined"
                fullWidth
                value={formData.process}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('process', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="riskAssessmentReportNo">Risk assessment report no.</CustomFormLabel>
              <CustomTextField
                id="riskAssessmentReportNo"
                variant="outlined"
                fullWidth
                value={formData.riskAssessmentReportNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('riskAssessmentReportNo', e.target.value)}
                placeholder="-------/-------"
              />
            </Grid>
          </Grid>

          {/* Risk Priority Legend */}
          <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Risk Priority No. (RPN) Legend</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip label="High Risk: 12 – 27" color="error" />
                </Grid>
                <Grid item>
                  <Chip label="Medium Risk: 6 – 9" color="warning" />
                </Grid>
                <Grid item>
                  <Chip label="Low Risk: 1 - 4" color="success" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Risk Assessment and Evaluation
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addEntry}
                  size="small"
                >
                  Add Risk Entry
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 80 }}>Risk No.</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Risk Description</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Risk Class</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>Risk Impact</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>RPN</TableCell>
                      <TableCell colSpan={5} align="center">The related Dept. control</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell align="center">QA</TableCell>
                      <TableCell align="center">Operation</TableCell>
                      <TableCell align="center">Warehouse</TableCell>
                      <TableCell align="center">Delivery</TableCell>
                      <TableCell align="center">Facility</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.riskNumber}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskNumber', e.target.value)}
                            placeholder="Risk #"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={2}
                            value={entry.riskDescription}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskDescription', e.target.value)}
                            placeholder="Risk description"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.riskClass}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskClass', e.target.value)}
                            placeholder="Class"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={2}
                            value={entry.riskImpact}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskImpact', e.target.value)}
                            placeholder="Risk impact"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            value={entry.rpn}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'rpn', e.target.value)}
                            placeholder="RPN"
                          />
                          {entry.rpn && (
                            <Chip
                              label={getRiskPriorityLabel(entry.rpn)}
                              color={getRiskPriorityColor(entry.rpn)}
                              size="small"
                              sx={{ mt: 1, display: 'block' }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={entry.qaControl}
                            onChange={(e) => handleEntryChange(entry.id, 'qaControl', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={entry.operationControl}
                            onChange={(e) => handleEntryChange(entry.id, 'operationControl', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={entry.warehouseControl}
                            onChange={(e) => handleEntryChange(entry.id, 'warehouseControl', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={entry.deliveryControl}
                            onChange={(e) => handleEntryChange(entry.id, 'deliveryControl', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={entry.facilityControl}
                            onChange={(e) => handleEntryChange(entry.id, 'facilityControl', e.target.checked)}
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

          {/* Approval Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Approval Section
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Sig./Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Prepared by</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.preparedByName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('preparedByName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.preparedBySignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('preparedBySignDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Reviewed by</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.reviewedByName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewedByName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.reviewedBySignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewedBySignDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>QA Manager</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.qaManagerName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('qaManagerName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.qaManagerSignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('qaManagerSignDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
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
              Save Notification
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => window.location.reload()}
            >
              Reset Form
            </Button>
          </Stack>

        </Box>
    </PageContainer>
  );
};

export default RiskNotificationForm;


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
    title: 'Risk Assessment Report',
  },
];

interface RiskItem {
  id: string;
  riskNo: string;
  riskDescription: string;
  riskImpact: string;
  probabilityBefore: string;
  severityBefore: string;
  detectabilityBefore: string;
  riskClassBefore: string;
  riskPriorityBefore: string;
  rpnBefore: string;
  controlMeasures: string;
  probabilityAfter: string;
  severityAfter: string;
  detectabilityAfter: string;
  riskClassAfter: string;
  riskPriorityAfter: string;
  rpnAfter: string;
}

interface RiskAssessmentData {
  reportNo: string;
  department: string;
  date: Date | null;
  process: string;
  processOwner: string;
  departmentManager: string;
  qaAssociate: string;
  qaManager: string;
  riskItems: RiskItem[];
}

const RiskAssessmentForm: React.FC = () => {
  const [formData, setFormData] = useState<RiskAssessmentData>({
    reportNo: '',
    department: '',
    date: null,
    process: '',
    processOwner: '',
    departmentManager: '',
    qaAssociate: '',
    qaManager: '',
    riskItems: [
      {
        id: '1',
        riskNo: '',
        riskDescription: '',
        riskImpact: '',
        probabilityBefore: '',
        severityBefore: '',
        detectabilityBefore: '',
        riskClassBefore: '',
        riskPriorityBefore: '',
        rpnBefore: '',
        controlMeasures: '',
        probabilityAfter: '',
        severityAfter: '',
        detectabilityAfter: '',
        riskClassAfter: '',
        riskPriorityAfter: '',
        rpnAfter: '',
      }
    ],
  });

  const handleInputChange = (field: keyof RiskAssessmentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRiskItemChange = (id: string, field: keyof RiskItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      riskItems: prev.riskItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRiskItem = () => {
    const newId = (formData.riskItems.length + 1).toString();
    const newRiskItem: RiskItem = {
      id: newId,
      riskNo: '',
      riskDescription: '',
      riskImpact: '',
      probabilityBefore: '',
      severityBefore: '',
      detectabilityBefore: '',
      riskClassBefore: '',
      riskPriorityBefore: '',
      rpnBefore: '',
      controlMeasures: '',
      probabilityAfter: '',
      severityAfter: '',
      detectabilityAfter: '',
      riskClassAfter: '',
      riskPriorityAfter: '',
      rpnAfter: '',
    };
    
    setFormData(prev => ({
      ...prev,
      riskItems: [...prev.riskItems, newRiskItem]
    }));
  };

  const removeRiskItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      riskItems: prev.riskItems.filter(item => item.id !== id)
    }));
  };

  const calculateRPN = (probability: string, severity: string, detectability: string): string => {
    const prob = parseInt(probability) || 0;
    const sev = parseInt(severity) || 0;
    const det = parseInt(detectability) || 0;
    return (prob * sev * det).toString();
  };

  const handleSubmit = () => {
    console.log('Risk Assessment Data:', formData);
    // Here you would typically send the data to your backend
  };

  const probabilityOptions = [
    { value: '1', label: '1 - Very Low' },
    { value: '2', label: '2 - Low' },
    { value: '3', label: '3 - Medium' },
    { value: '4', label: '4 - High' },
    { value: '5', label: '5 - Very High' },
  ];

  const severityOptions = [
    { value: '1', label: '1 - Negligible' },
    { value: '2', label: '2 - Minor' },
    { value: '3', label: '3 - Moderate' },
    { value: '4', label: '4 - Major' },
    { value: '5', label: '5 - Catastrophic' },
  ];

  const detectabilityOptions = [
    { value: '1', label: '1 - Very High' },
    { value: '2', label: '2 - High' },
    { value: '3', label: '3 - Medium' },
    { value: '4', label: '4 - Low' },
    { value: '5', label: '5 - Very Low' },
  ];

  const riskClassOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <PageContainer title="Risk Assessment Report" description="Healthcare Division Risk Assessment Report">
      <Breadcrumb title="Risk Assessment Report" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Risk Assessment Report">
        <Box component="form" sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            
            {/* Header Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Report Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="reportNo">Risk assessment report No.</CustomFormLabel>
                    <CustomTextField
                      id="reportNo"
                      variant="outlined"
                      fullWidth
                      value={formData.reportNo}
                      onChange={(e) => handleInputChange('reportNo', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="department">Department</CustomFormLabel>
                    <CustomTextField
                      id="department"
                      variant="outlined"
                      fullWidth
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="date">Date</CustomFormLabel>
                    <DateTimePicker
                      value={formData.date}
                      onChange={(newValue) => handleInputChange('date', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="process">Process</CustomFormLabel>
                    <CustomTextField
                      id="process"
                      variant="outlined"
                      fullWidth
                      value={formData.process}
                      onChange={(e) => handleInputChange('process', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Risk Assessment Table */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    Risk Assessment Matrix
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addRiskItem}
                    size="small"
                  >
                    Add Risk Item
                  </Button>
                </Box>
                
                <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell rowSpan={2} sx={{ minWidth: 60 }}>Risk No.</TableCell>
                        <TableCell rowSpan={2} sx={{ minWidth: 150 }}>Risk Description</TableCell>
                        <TableCell rowSpan={2} sx={{ minWidth: 150 }}>Risk Impact</TableCell>
                        <TableCell colSpan={6} align="center" sx={{ backgroundColor: '#f5f5f5' }}>
                          Risk Priority Before Control Measures
                        </TableCell>
                        <TableCell rowSpan={2} sx={{ minWidth: 200 }}>Control Measures</TableCell>
                        <TableCell colSpan={6} align="center" sx={{ backgroundColor: '#e8f5e8' }}>
                          Assessment of Risk After Control Measures
                        </TableCell>
                        <TableCell rowSpan={2} sx={{ minWidth: 60 }}>Actions</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ minWidth: 80 }}>Probability</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Severity</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Detectability</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Risk Class</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Risk Priority</TableCell>
                        <TableCell sx={{ minWidth: 60 }}>RPN</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Probability</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Severity</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Detectability</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Risk Class</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Risk Priority</TableCell>
                        <TableCell sx={{ minWidth: 60 }}>RPN</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.riskItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={item.riskNo}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskNo', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={2}
                              value={item.riskDescription}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskDescription', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={2}
                              value={item.riskImpact}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskImpact', e.target.value)}
                            />
                          </TableCell>
                          
                          {/* Before Control Measures */}
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.probabilityBefore}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'probabilityBefore', e.target.value);
                                const rpn = calculateRPN(e.target.value, item.severityBefore, item.detectabilityBefore);
                                handleRiskItemChange(item.id, 'rpnBefore', rpn);
                              }}
                            >
                              {probabilityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.severityBefore}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'severityBefore', e.target.value);
                                const rpn = calculateRPN(item.probabilityBefore, e.target.value, item.detectabilityBefore);
                                handleRiskItemChange(item.id, 'rpnBefore', rpn);
                              }}
                            >
                              {severityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.detectabilityBefore}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'detectabilityBefore', e.target.value);
                                const rpn = calculateRPN(item.probabilityBefore, item.severityBefore, e.target.value);
                                handleRiskItemChange(item.id, 'rpnBefore', rpn);
                              }}
                            >
                              {detectabilityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.riskClassBefore}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskClassBefore', e.target.value)}
                            >
                              {riskClassOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={item.riskPriorityBefore}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskPriorityBefore', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={item.rpnBefore}
                              InputProps={{ readOnly: true }}
                              sx={{ backgroundColor: '#f5f5f5' }}
                            />
                          </TableCell>
                          
                          {/* Control Measures */}
                          <TableCell>
                            <CustomTextField
                              size="small"
                              multiline
                              rows={3}
                              value={item.controlMeasures}
                              onChange={(e) => handleRiskItemChange(item.id, 'controlMeasures', e.target.value)}
                            />
                          </TableCell>
                          
                          {/* After Control Measures */}
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.probabilityAfter}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'probabilityAfter', e.target.value);
                                const rpn = calculateRPN(e.target.value, item.severityAfter, item.detectabilityAfter);
                                handleRiskItemChange(item.id, 'rpnAfter', rpn);
                              }}
                            >
                              {probabilityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.severityAfter}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'severityAfter', e.target.value);
                                const rpn = calculateRPN(item.probabilityAfter, e.target.value, item.detectabilityAfter);
                                handleRiskItemChange(item.id, 'rpnAfter', rpn);
                              }}
                            >
                              {severityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.detectabilityAfter}
                              onChange={(e) => {
                                handleRiskItemChange(item.id, 'detectabilityAfter', e.target.value);
                                const rpn = calculateRPN(item.probabilityAfter, item.severityAfter, e.target.value);
                                handleRiskItemChange(item.id, 'rpnAfter', rpn);
                              }}
                            >
                              {detectabilityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomSelect
                              size="small"
                              value={item.riskClassAfter}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskClassAfter', e.target.value)}
                            >
                              {riskClassOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </CustomSelect>
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={item.riskPriorityAfter}
                              onChange={(e) => handleRiskItemChange(item.id, 'riskPriorityAfter', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={item.rpnAfter}
                              InputProps={{ readOnly: true }}
                              sx={{ backgroundColor: '#e8f5e8' }}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => removeRiskItem(item.id)}
                              disabled={formData.riskItems.length === 1}
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
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="processOwner">Process Owner</CustomFormLabel>
                    <CustomTextField
                      id="processOwner"
                      variant="outlined"
                      fullWidth
                      value={formData.processOwner}
                      onChange={(e) => handleInputChange('processOwner', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="departmentManager">Department Manager</CustomFormLabel>
                    <CustomTextField
                      id="departmentManager"
                      variant="outlined"
                      fullWidth
                      value={formData.departmentManager}
                      onChange={(e) => handleInputChange('departmentManager', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="qaAssociate">QA Associate</CustomFormLabel>
                    <CustomTextField
                      id="qaAssociate"
                      variant="outlined"
                      fullWidth
                      value={formData.qaAssociate}
                      onChange={(e) => handleInputChange('qaAssociate', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="qaManager">QA Manager</CustomFormLabel>
                    <CustomTextField
                      id="qaManager"
                      variant="outlined"
                      fullWidth
                      value={formData.qaManager}
                      onChange={(e) => handleInputChange('qaManager', e.target.value)}
                    />
                  </Grid>
                </Grid>
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
                Submit Report
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => setFormData({
                  reportNo: '',
                  department: '',
                  date: null,
                  process: '',
                  processOwner: '',
                  departmentManager: '',
                  qaAssociate: '',
                  qaManager: '',
                  riskItems: [
                    {
                      id: '1',
                      riskNo: '',
                      riskDescription: '',
                      riskImpact: '',
                      probabilityBefore: '',
                      severityBefore: '',
                      detectabilityBefore: '',
                      riskClassBefore: '',
                      riskPriorityBefore: '',
                      rpnBefore: '',
                      controlMeasures: '',
                      probabilityAfter: '',
                      severityAfter: '',
                      detectabilityAfter: '',
                      riskClassAfter: '',
                      riskPriorityAfter: '',
                      rpnAfter: '',
                    }
                  ],
                })}
              >
                Reset Form
              </Button>
            </Stack>

          </LocalizationProvider>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default RiskAssessmentForm;


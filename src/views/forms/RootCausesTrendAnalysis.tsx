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
  Paper} from '@mui/material';

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
    title: 'Root Causes Trend Analysis',
  },
];

interface TrendAnalysisData {
  analysisPeriodStart: Date | null;
  analysisPeriodEnd: Date | null;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  rootCauseCategories: string[];
  dataPoints: {
    category: string;
    count: number;
    percentage: number;
    trends: string;
    recommendations: string;
  }[];
}

const RootCausesTrendAnalysis: React.FC = () => {
  const [formData, setFormData] = useState<TrendAnalysisData>({
    analysisPeriodStart: null,
    analysisPeriodEnd: null,
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    rootCauseCategories: [
      'Human Error',
      'Equipment Malfunction',
      'Process Failure',
      'Material Defect',
      'Documentation Error',
      'Training Deficiency',
      'Environmental Factors',
      'Supplier Issue',
      'Other'
    ],
    dataPoints: []
  });

  // Initialize dataPoints based on rootCauseCategories
  React.useEffect(() => {
    const initialDataPoints = formData.rootCauseCategories.map(category => ({
      category,
      count: 0,
      percentage: 0,
      trends: '',
      recommendations: ''
    }));
    setFormData(prev => ({ ...prev, dataPoints: initialDataPoints }));
  }, []);

  const handleInputChange = (field: keyof TrendAnalysisData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataPointChange = (index: number, field: string, value: any) => {
    const updatedDataPoints = [...formData.dataPoints];
    updatedDataPoints[index] = {
      ...updatedDataPoints[index],
      [field]: value
    };
    // Recalculate percentages if count changes
    if (field === 'count') {
      const totalCount = updatedDataPoints.reduce((sum, dp) => sum + (dp.count || 0), 0);
      updatedDataPoints.forEach(dp => {
        dp.percentage = totalCount > 0 ? parseFloat(((dp.count / totalCount) * 100).toFixed(2)) : 0;
      });
    }
    setFormData(prev => ({
      ...prev,
      dataPoints: updatedDataPoints
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Handle form submission logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer title="Root Causes Trend Analysis" description="Analysis of trends in root causes of non-conformities">
      <Breadcrumb title="Root Causes Trend Analysis" items={BCrumb} />
      
      <ParentCard title="Root Causes Trend Analysis">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="analysisPeriodStart">Analysis Period Start Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.analysisPeriodStart}
                  onChange={(newValue) => handleInputChange('analysisPeriodStart', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="analysisPeriodEnd">Analysis Period End Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.analysisPeriodEnd}
                  onChange={(newValue) => handleInputChange('analysisPeriodEnd', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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

          {/* Trend Analysis Table */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Root Cause Trend Analysis Data
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Root Cause Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Count</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Percentage (%)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trends Observed</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Recommendations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.dataPoints.map((dataPoint, index) => (
                      <TableRow key={index}>
                        <TableCell>{dataPoint.category}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            type="number"
                            value={dataPoint.count}
                            onChange={(e: { target: { value: string; }; }) => handleDataPointChange(index, 'count', parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>{dataPoint.percentage}%</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={dataPoint.trends}
                            onChange={(e: { target: { value: any; }; }) => handleDataPointChange(index, 'trends', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={dataPoint.recommendations}
                            onChange={(e: { target: { value: any; }; }) => handleDataPointChange(index, 'recommendations', e.target.value)}
                          />
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

export default RootCausesTrendAnalysis;


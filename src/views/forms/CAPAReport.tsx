import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  Button,
  Card,
  CardContent,
  Stack,
  MenuItem,
  Select
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
    title: 'CAPA Report',
  },
];

interface CAPAReportData {
  capaNo: string;
  ncrDeviationNo: string;
  reportDate: Date | null;
  reportedBy: string;
  department: string;
  problemDescription: string;
  rootCauseAnalysis: string;
  correctiveAction: string;
  preventiveAction: string;
  responsiblePerson: string;
  targetDate: Date | null;
  actualCompletionDate: Date | null;
  verificationMethod: string;
  verificationDate: Date | null;
  verifiedBy: string;
  effectivenessCheck: string;
  effectivenessDate: Date | null;
  effectivenessBy: string;
  status: string;
  reviewerName: string;
  reviewerSignature: string;
  reviewDate: Date | null;
  approverName: string;
  approverSignature: string;
  approvalDate: Date | null;
  closureDate: Date | null;
  closedBy: string;
}

const CAPAReport: React.FC = () => {
  const [formData, setFormData] = useState<CAPAReportData>({
    capaNo: '',
    ncrDeviationNo: '',
    reportDate: null,
    reportedBy: '',
    department: '',
    problemDescription: '',
    rootCauseAnalysis: '',
    correctiveAction: '',
    preventiveAction: '',
    responsiblePerson: '',
    targetDate: null,
    actualCompletionDate: null,
    verificationMethod: '',
    verificationDate: null,
    verifiedBy: '',
    effectivenessCheck: '',
    effectivenessDate: null,
    effectivenessBy: '',
    status: 'Open',
    reviewerName: '',
    reviewerSignature: '',
    reviewDate: null,
    approverName: '',
    approverSignature: '',
    approvalDate: null,
    closureDate: null,
    closedBy: ''
  });

  const handleInputChange = (field: keyof CAPAReportData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    <PageContainer title="CAPA Report" description="Corrective and Preventive Action Report Form">
      <Breadcrumb title="CAPA Report" items={BCrumb} />
      
      <ParentCard title="CAPA Report">
        <Box component="form" noValidate>
          {/* Report Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                CAPA Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="capaNo">CAPA No.</CustomFormLabel>
                  <CustomTextField
                    id="capaNo"
                    variant="outlined"
                    fullWidth
                    value={formData.capaNo}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('capaNo', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="ncrDeviationNo">NCR/Deviation No.</CustomFormLabel>
                  <CustomTextField
                    id="ncrDeviationNo"
                    variant="outlined"
                    fullWidth
                    value={formData.ncrDeviationNo}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('ncrDeviationNo', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="reportDate">Report Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.reportDate}
                      onChange={(newValue) => handleInputChange('reportDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="reportedBy">Reported By</CustomFormLabel>
                  <CustomTextField
                    id="reportedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.reportedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reportedBy', e.target.value)}
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
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="problemDescription">Problem Description</CustomFormLabel>
                  <CustomTextField
                    id="problemDescription"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.problemDescription}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('problemDescription', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Root Cause Analysis & Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Root Cause Analysis & Actions
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="rootCauseAnalysis">Root Cause Analysis</CustomFormLabel>
                  <CustomTextField
                    id="rootCauseAnalysis"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.rootCauseAnalysis}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('rootCauseAnalysis', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="correctiveAction">Corrective Action</CustomFormLabel>
                  <CustomTextField
                    id="correctiveAction"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.correctiveAction}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('correctiveAction', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="preventiveAction">Preventive Action</CustomFormLabel>
                  <CustomTextField
                    id="preventiveAction"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.preventiveAction}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('preventiveAction', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="responsiblePerson">Responsible Person</CustomFormLabel>
                  <CustomTextField
                    id="responsiblePerson"
                    variant="outlined"
                    fullWidth
                    value={formData.responsiblePerson}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('responsiblePerson', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="targetDate">Target Completion Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.targetDate}
                      onChange={(newValue) => handleInputChange('targetDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="actualCompletionDate">Actual Completion Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.actualCompletionDate}
                      onChange={(newValue) => handleInputChange('actualCompletionDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Verification
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="verificationMethod">Verification Method</CustomFormLabel>
                  <CustomTextField
                    id="verificationMethod"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.verificationMethod}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('verificationMethod', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="verificationDate">Verification Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.verificationDate}
                      onChange={(newValue) => handleInputChange('verificationDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="verifiedBy">Verified By</CustomFormLabel>
                  <CustomTextField
                    id="verifiedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.verifiedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('verifiedBy', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Effectiveness Check */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Effectiveness Check
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="effectivenessCheck">Effectiveness Check</CustomFormLabel>
                  <CustomTextField
                    id="effectivenessCheck"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.effectivenessCheck}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('effectivenessCheck', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="effectivenessDate">Effectiveness Check Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.effectivenessDate}
                      onChange={(newValue) => handleInputChange('effectivenessDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="effectivenessBy">Checked By</CustomFormLabel>
                  <CustomTextField
                    id="effectivenessBy"
                    variant="outlined"
                    fullWidth
                    value={formData.effectivenessBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('effectivenessBy', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Approval & Closure */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Approval & Closure
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Under Investigation">Under Investigation</MenuItem>
                      <MenuItem value="Action Planned">Action Planned</MenuItem>
                      <MenuItem value="Action Implemented">Action Implemented</MenuItem>
                      <MenuItem value="Under Verification">Under Verification</MenuItem>
                      <MenuItem value="Effectiveness Check">Effectiveness Check</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="reviewerName">Reviewer Name</CustomFormLabel>
                  <CustomTextField
                    id="reviewerName"
                    variant="outlined"
                    fullWidth
                    value={formData.reviewerName}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewerName', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="reviewerSignature">Reviewer Signature</CustomFormLabel>
                  <CustomTextField
                    id="reviewerSignature"
                    variant="outlined"
                    fullWidth
                    value={formData.reviewerSignature}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewerSignature', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="reviewDate">Review Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.reviewDate}
                      onChange={(newValue) => handleInputChange('reviewDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="approverName">Approver Name</CustomFormLabel>
                  <CustomTextField
                    id="approverName"
                    variant="outlined"
                    fullWidth
                    value={formData.approverName}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('approverName', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="approverSignature">Approver Signature</CustomFormLabel>
                  <CustomTextField
                    id="approverSignature"
                    variant="outlined"
                    fullWidth
                    value={formData.approverSignature}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('approverSignature', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="approvalDate">Approval Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.approvalDate}
                      onChange={(newValue) => handleInputChange('approvalDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="closureDate">Closure Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.closureDate}
                      onChange={(newValue) => handleInputChange('closureDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="closedBy">Closed By</CustomFormLabel>
                  <CustomTextField
                    id="closedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.closedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('closedBy', e.target.value)}
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

export default CAPAReport;


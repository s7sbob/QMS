import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
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
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'CAPA Effectiveness Check',
  },
];

interface CAPAEffectivenessData {
  capaNo: string;
  ncrDeviationNo: string;
  checkDate: Date | null;
  checkedBy: string;
  department: string;
  problemDescription: string;
  correctiveAction: string;
  preventiveAction: string;
  implementationDate: Date | null;
  verificationMethod: string;
  verificationDate: Date | null;
  verifiedBy: string;
  effectivenessResult: string;
  effectivenessRemarks: string;
  nextCheckDate: Date | null;
  status: string;
  reviewerName: string;
  reviewerSignature: string;
  reviewDate: Date | null;
  approverName: string;
  approverSignature: string;
  approvalDate: Date | null;
}

const CAPAEffectivenessCheck: React.FC = () => {
  const [formData, setFormData] = useState<CAPAEffectivenessData>({
    capaNo: '',
    ncrDeviationNo: '',
    checkDate: null,
    checkedBy: '',
    department: '',
    problemDescription: '',
    correctiveAction: '',
    preventiveAction: '',
    implementationDate: null,
    verificationMethod: '',
    verificationDate: null,
    verifiedBy: '',
    effectivenessResult: '',
    effectivenessRemarks: '',
    nextCheckDate: null,
    status: 'Open',
    reviewerName: '',
    reviewerSignature: '',
    reviewDate: null,
    approverName: '',
    approverSignature: '',
    approvalDate: null,
  });

  const handleInputChange = (field: keyof CAPAEffectivenessData, value: any) => {
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
    <PageContainer title="CAPA Effectiveness Check" description="CAPA Effectiveness Check Form">
      <Breadcrumb title="CAPA Effectiveness Check" items={BCrumb} />
      
      <ParentCard title="CAPA Effectiveness Check">
        <Box component="form" noValidate>
          {/* Check Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Effectiveness Check Information
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
                  <CustomFormLabel htmlFor="checkDate">Check Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.checkDate}
                      onChange={(newValue) => handleInputChange('checkDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="checkedBy">Checked By</CustomFormLabel>
                  <CustomTextField
                    id="checkedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.checkedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('checkedBy', e.target.value)}
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
                  <CustomFormLabel htmlFor="implementationDate">Implementation Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.implementationDate}
                      onChange={(newValue) => handleInputChange('implementationDate', newValue)}
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

          {/* Effectiveness Result */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Effectiveness Result
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="effectivenessResult">Effectiveness Result</CustomFormLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      value={formData.effectivenessResult}
                      onChange={(e) => handleInputChange('effectivenessResult', e.target.value)}
                    >
                      <FormControlLabel value="Effective" control={<CustomRadio />} label="Effective" />
                      <FormControlLabel value="Not Effective" control={<CustomRadio />} label="Not Effective" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="effectivenessRemarks">Remarks on Effectiveness</CustomFormLabel>
                  <CustomTextField
                    id="effectivenessRemarks"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.effectivenessRemarks}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('effectivenessRemarks', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="nextCheckDate">Next Effectiveness Check Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.nextCheckDate}
                      onChange={(newValue) => handleInputChange('nextCheckDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Approval & Status */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Approval & Status
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

export default CAPAEffectivenessCheck;


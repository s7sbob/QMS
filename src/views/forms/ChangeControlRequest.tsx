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
    title: 'Change Control Request',
  },
];

interface ChangeControlData {
  changeRequestNo: string;
  requestDate: Date | null;
  requestedBy: string;
  department: string;
  changeTitle: string;
  changeDescription: string;
  reasonForChange: string;
  urgency: string;
  changeType: string;
  affectedDocuments: string;
  affectedSystems: string;
  riskAssessment: string;
  proposedImplementationDate: Date | null;
  resourcesRequired: string;
  trainingRequired: string;
  validationRequired: string;
  approvalLevel: string;
  reviewerComments: string;
  reviewerName: string;
  reviewerSignature: string;
  reviewDate: Date | null;
  approverComments: string;
  approverName: string;
  approverSignature: string;
  approvalDate: Date | null;
  implementationDate: Date | null;
  implementedBy: string;
  verificationDate: Date | null;
  verifiedBy: string;
  effectivenessCheck: string;
  status: string;
}

const ChangeControlRequest: React.FC = () => {
  const [formData, setFormData] = useState<ChangeControlData>({
    changeRequestNo: '',
    requestDate: null,
    requestedBy: '',
    department: '',
    changeTitle: '',
    changeDescription: '',
    reasonForChange: '',
    urgency: '',
    changeType: '',
    affectedDocuments: '',
    affectedSystems: '',
    riskAssessment: '',
    proposedImplementationDate: null,
    resourcesRequired: '',
    trainingRequired: '',
    validationRequired: '',
    approvalLevel: '',
    reviewerComments: '',
    reviewerName: '',
    reviewerSignature: '',
    reviewDate: null,
    approverComments: '',
    approverName: '',
    approverSignature: '',
    approvalDate: null,
    implementationDate: null,
    implementedBy: '',
    verificationDate: null,
    verifiedBy: '',
    effectivenessCheck: '',
    status: 'Pending'
  });

  const handleInputChange = (field: keyof ChangeControlData, value: any) => {
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
    <PageContainer title="Change Control Request" description="Change Control Request Form">
      <Breadcrumb title="Change Control Request" items={BCrumb} />
      
      <ParentCard title="Change Control Request">
        <Box component="form" noValidate>
          {/* Request Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Request Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="changeRequestNo">Change Request No.</CustomFormLabel>
                  <CustomTextField
                    id="changeRequestNo"
                    variant="outlined"
                    fullWidth
                    value={formData.changeRequestNo}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('changeRequestNo', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="requestDate">Request Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.requestDate}
                      onChange={(newValue) => handleInputChange('requestDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="requestedBy">Requested By</CustomFormLabel>
                  <CustomTextField
                    id="requestedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.requestedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('requestedBy', e.target.value)}
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
                  <CustomFormLabel htmlFor="changeTitle">Change Title</CustomFormLabel>
                  <CustomTextField
                    id="changeTitle"
                    variant="outlined"
                    fullWidth
                    value={formData.changeTitle}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('changeTitle', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="changeDescription">Change Description</CustomFormLabel>
                  <CustomTextField
                    id="changeDescription"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.changeDescription}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('changeDescription', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="reasonForChange">Reason for Change</CustomFormLabel>
                  <CustomTextField
                    id="reasonForChange"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.reasonForChange}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reasonForChange', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="urgency">Urgency</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="changeType">Change Type</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.changeType}
                      onChange={(e) => handleInputChange('changeType', e.target.value)}
                    >
                      <MenuItem value="Minor">Minor</MenuItem>
                      <MenuItem value="Major">Major</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="affectedDocuments">Affected Documents</CustomFormLabel>
                  <CustomTextField
                    id="affectedDocuments"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.affectedDocuments}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('affectedDocuments', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="affectedSystems">Affected Systems</CustomFormLabel>
                  <CustomTextField
                    id="affectedSystems"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.affectedSystems}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('affectedSystems', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="riskAssessment">Risk Assessment</CustomFormLabel>
                  <CustomTextField
                    id="riskAssessment"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.riskAssessment}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('riskAssessment', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="proposedImplementationDate">Proposed Implementation Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.proposedImplementationDate}
                      onChange={(newValue) => handleInputChange('proposedImplementationDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="resourcesRequired">Resources Required</CustomFormLabel>
                  <CustomTextField
                    id="resourcesRequired"
                    variant="outlined"
                    fullWidth
                    value={formData.resourcesRequired}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('resourcesRequired', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Training Required</CustomFormLabel>
                  <FormControl>
                    <RadioGroup
                      value={formData.trainingRequired}
                      onChange={(e) => handleInputChange('trainingRequired', e.target.value)}
                      row
                    >
                      <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                      <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Validation Required</CustomFormLabel>
                  <FormControl>
                    <RadioGroup
                      value={formData.validationRequired}
                      onChange={(e) => handleInputChange('validationRequired', e.target.value)}
                      row
                    >
                      <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                      <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Review Section
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="reviewerComments">Reviewer Comments</CustomFormLabel>
                  <CustomTextField
                    id="reviewerComments"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.reviewerComments}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewerComments', e.target.value)}
                  />
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
              </Grid>
            </CardContent>
          </Card>

          {/* Approval Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Approval Section
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="approverComments">Approver Comments</CustomFormLabel>
                  <CustomTextField
                    id="approverComments"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.approverComments}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('approverComments', e.target.value)}
                  />
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

          {/* Implementation Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Implementation Section
              </Typography>
              
              <Grid container spacing={3}>
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
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="implementedBy">Implemented By</CustomFormLabel>
                  <CustomTextField
                    id="implementedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.implementedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('implementedBy', e.target.value)}
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
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="effectivenessCheck">Effectiveness Check</CustomFormLabel>
                  <CustomTextField
                    id="effectivenessCheck"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.effectivenessCheck}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('effectivenessCheck', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Implemented">Implemented</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
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

export default ChangeControlRequest;


import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
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
    title: 'New Creation SOP',
  },
];

interface NewCreationSOPData {
  sopTitle: string;
  sopNumber: string;
  version: string;
  effectiveDate: Date | null;
  preparedBy: string;
  preparedDate: Date | null;
  reviewedBy: string;
  reviewDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  purpose: string;
  scope: string;
  responsibilities: string;
  procedure: string;
  references: string;
  attachments: string;
  distributionList: string;
  trainingRequired: string;
  status: string;
}

const NewCreationSOP: React.FC = () => {
  const [formData, setFormData] = useState<NewCreationSOPData>({
    sopTitle: '',
    sopNumber: '',
    version: '1.0',
    effectiveDate: null,
    preparedBy: '',
    preparedDate: null,
    reviewedBy: '',
    reviewDate: null,
    approvedBy: '',
    approvalDate: null,
    purpose: '',
    scope: '',
    responsibilities: '',
    procedure: '',
    references: '',
    attachments: '',
    distributionList: '',
    trainingRequired: 'Yes',
    status: 'Draft',
  });

  const handleInputChange = (field: keyof NewCreationSOPData, value: any) => {
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
    <PageContainer title="New Creation SOP" description="Form for creating a new Standard Operating Procedure">
      <Breadcrumb title="New Creation SOP" items={BCrumb} />
      
      <ParentCard title="New Creation SOP">
        <Box component="form" noValidate>
          {/* SOP Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                SOP Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="sopTitle">SOP Title</CustomFormLabel>
                  <CustomTextField
                    id="sopTitle"
                    variant="outlined"
                    fullWidth
                    value={formData.sopTitle}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('sopTitle', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="sopNumber">SOP Number</CustomFormLabel>
                  <CustomTextField
                    id="sopNumber"
                    variant="outlined"
                    fullWidth
                    value={formData.sopNumber}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('sopNumber', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="version">Version</CustomFormLabel>
                  <CustomTextField
                    id="version"
                    variant="outlined"
                    fullWidth
                    value={formData.version}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('version', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="effectiveDate">Effective Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.effectiveDate}
                      onChange={(newValue) => handleInputChange('effectiveDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Preparation & Approval */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Preparation & Approval
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="preparedBy">Prepared By</CustomFormLabel>
                  <CustomTextField
                    id="preparedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.preparedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('preparedBy', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="preparedDate">Prepared Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.preparedDate}
                      onChange={(newValue) => handleInputChange('preparedDate', newValue)}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="reviewedBy">Reviewed By</CustomFormLabel>
                  <CustomTextField
                    id="reviewedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.reviewedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('reviewedBy', e.target.value)}
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
                  <CustomFormLabel htmlFor="approvedBy">Approved By</CustomFormLabel>
                  <CustomTextField
                    id="approvedBy"
                    variant="outlined"
                    fullWidth
                    value={formData.approvedBy}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('approvedBy', e.target.value)}
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

          {/* Content Sections */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                SOP Content
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="purpose">Purpose</CustomFormLabel>
                  <CustomTextField
                    id="purpose"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.purpose}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('purpose', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="scope">Scope</CustomFormLabel>
                  <CustomTextField
                    id="scope"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.scope}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('scope', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="responsibilities">Responsibilities</CustomFormLabel>
                  <CustomTextField
                    id="responsibilities"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.responsibilities}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('responsibilities', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="procedure">Procedure</CustomFormLabel>
                  <CustomTextField
                    id="procedure"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={8}
                    value={formData.procedure}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('procedure', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="references">References</CustomFormLabel>
                  <CustomTextField
                    id="references"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.references}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('references', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="attachments">Attachments</CustomFormLabel>
                  <CustomTextField
                    id="attachments"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.attachments}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('attachments', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Distribution & Training */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Distribution & Training
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="distributionList">Distribution List</CustomFormLabel>
                  <CustomTextField
                    id="distributionList"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.distributionList}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('distributionList', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="trainingRequired">Training Required</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.trainingRequired}
                      onChange={(e) => handleInputChange('trainingRequired', e.target.value)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Effective">Effective</MenuItem>
                      <MenuItem value="Obsolete">Obsolete</MenuItem>
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

export default NewCreationSOP;


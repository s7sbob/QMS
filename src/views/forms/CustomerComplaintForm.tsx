import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Checkbox,
  FormGroup,
  Stack
} from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Customer Complaint Form',
  },
];

interface ComplaintFormData {
  complaintNo: string;
  receiptDate: Date | null;
  receiptTime: string;
  receivedVia: string;
  receivedBy: string;
  receivedBySign: string;
  complaintSource: string;
  complainantName: string;
  location: string;
  productName: string;
  batchNo: string;
  packageSize: string;
  strength: string;
  dosageForm: string;
  mfgDate: Date | null;
  expDate: Date | null;
  complaintDescription: string;
  sampleProvided: boolean;
  sampleCount: string;
  customerEmail: string;
  customerPhone: string;
  reportableToSFDA: boolean;
  sfdaReference: string;
  complaintCategory: string;
  classification: string;
  qaInvestigation: string;
  safetyConcern: string;
  actionsTaken: string;
  capaNumber: string;
  supplierInformed: string;
  complaintClosedDate: Date | null;
  customerNotificationDate: Date | null;
  productRecall: boolean;
  finalComment: string;
  reportedBy: string;
  approvedBy: string;
}

const CustomerComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    complaintNo: '',
    receiptDate: null,
    receiptTime: '',
    receivedVia: '',
    receivedBy: '',
    receivedBySign: '',
    complaintSource: '',
    complainantName: '',
    location: '',
    productName: '',
    batchNo: '',
    packageSize: '',
    strength: '',
    dosageForm: '',
    mfgDate: null,
    expDate: null,
    complaintDescription: '',
    sampleProvided: false,
    sampleCount: '',
    customerEmail: '',
    customerPhone: '',
    reportableToSFDA: false,
    sfdaReference: '',
    complaintCategory: '',
    classification: '',
    qaInvestigation: '',
    safetyConcern: '',
    actionsTaken: '',
    capaNumber: '',
    supplierInformed: '',
    complaintClosedDate: null,
    customerNotificationDate: null,
    productRecall: false,
    finalComment: '',
    reportedBy: '',
    approvedBy: '',
  });

  const handleInputChange = (field: keyof ComplaintFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Here you would typically send the data to your backend
  };

  const receivedViaOptions = [
    { value: 'email', label: 'E-mail' },
    { value: 'fax', label: 'Fax' },
    { value: 'phone', label: 'Phone call' },
    { value: 'letter', label: 'Letter' },
    { value: 'verbally', label: 'Verbally' },
  ];

  const complaintSourceOptions = [
    { value: 'sub-distributer', label: 'Sub-distributer' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'patient', label: 'Patient/Public' },
    { value: 'authority', label: 'Authority' },
  ];

  const classificationOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'major', label: 'Major' },
    { value: 'minor', label: 'Minor' },
  ];

  return (
    <PageContainer title="Customer Complaint Form" description="Healthcare Division Customer Complaint Form">
      <Breadcrumb title="Customer Complaint Form" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Customer Complaint Form">
        <Box component="form" sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            
            {/* Basic Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Basic Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="complaintNo">Customer Complaint No.</CustomFormLabel>
                    <CustomTextField
                      id="complaintNo"
                      variant="outlined"
                      fullWidth
                      value={formData.complaintNo}
                      onChange={(e) => handleInputChange('complaintNo', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="receiptDate">Date of receipt</CustomFormLabel>
                    <DatePicker
                      value={formData.receiptDate}
                      onChange={(newValue) => handleInputChange('receiptDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="receiptTime">Time</CustomFormLabel>
                    <CustomTextField
                      id="receiptTime"
                      variant="outlined"
                      fullWidth
                      type="time"
                      value={formData.receiptTime}
                      onChange={(e) => handleInputChange('receiptTime', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Complaint Reception Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Complaint Reception Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomFormLabel>Complaint received via:</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.receivedVia}
                        onChange={(e) => handleInputChange('receivedVia', e.target.value)}
                      >
                        {receivedViaOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<CustomRadio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="receivedBy">Complaint received by</CustomFormLabel>
                    <CustomTextField
                      id="receivedBy"
                      variant="outlined"
                      fullWidth
                      value={formData.receivedBy}
                      onChange={(e) => handleInputChange('receivedBy', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="receivedBySign">Sign</CustomFormLabel>
                    <CustomTextField
                      id="receivedBySign"
                      variant="outlined"
                      fullWidth
                      value={formData.receivedBySign}
                      onChange={(e) => handleInputChange('receivedBySign', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CustomFormLabel>Complaint Source:</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.complaintSource}
                        onChange={(e) => handleInputChange('complaintSource', e.target.value)}
                      >
                        {complaintSourceOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<CustomRadio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="complainantName">Complainant Name</CustomFormLabel>
                    <CustomTextField
                      id="complainantName"
                      variant="outlined"
                      fullWidth
                      value={formData.complainantName}
                      onChange={(e) => handleInputChange('complainantName', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="location">Location / City</CustomFormLabel>
                    <CustomTextField
                      id="location"
                      variant="outlined"
                      fullWidth
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Product Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="productName">Product Name</CustomFormLabel>
                    <CustomTextField
                      id="productName"
                      variant="outlined"
                      fullWidth
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="batchNo">Batch #</CustomFormLabel>
                    <CustomTextField
                      id="batchNo"
                      variant="outlined"
                      fullWidth
                      value={formData.batchNo}
                      onChange={(e) => handleInputChange('batchNo', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="packageSize">Package Size</CustomFormLabel>
                    <CustomTextField
                      id="packageSize"
                      variant="outlined"
                      fullWidth
                      value={formData.packageSize}
                      onChange={(e) => handleInputChange('packageSize', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="strength">Strength</CustomFormLabel>
                    <CustomTextField
                      id="strength"
                      variant="outlined"
                      fullWidth
                      value={formData.strength}
                      onChange={(e) => handleInputChange('strength', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="dosageForm">Dosage Form</CustomFormLabel>
                    <CustomTextField
                      id="dosageForm"
                      variant="outlined"
                      fullWidth
                      value={formData.dosageForm}
                      onChange={(e) => handleInputChange('dosageForm', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="mfgDate">Mfg. Date</CustomFormLabel>
                    <DatePicker
                      value={formData.mfgDate}
                      onChange={(newValue) => handleInputChange('mfgDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="expDate">Exp. Date</CustomFormLabel>
                    <DatePicker
                      value={formData.expDate}
                      onChange={(newValue) => handleInputChange('expDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Complaint Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Complaint Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="complaintDescription">The complaint description</CustomFormLabel>
                    <CustomTextField
                      id="complaintDescription"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={formData.complaintDescription}
                      onChange={(e) => handleInputChange('complaintDescription', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <CustomCheckbox
                          checked={formData.sampleProvided}
                          onChange={(e) => handleInputChange('sampleProvided', e.target.checked)}
                        />
                      }
                      label="Complaint sample provided"
                    />
                    {formData.sampleProvided && (
                      <Box sx={{ mt: 1 }}>
                        <CustomFormLabel htmlFor="sampleCount">Number of samples</CustomFormLabel>
                        <CustomTextField
                          id="sampleCount"
                          variant="outlined"
                          fullWidth
                          value={formData.sampleCount}
                          onChange={(e) => handleInputChange('sampleCount', e.target.value)}
                        />
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="customerEmail">Customer E-mail</CustomFormLabel>
                    <CustomTextField
                      id="customerEmail"
                      variant="outlined"
                      fullWidth
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="customerPhone">Customer Phone</CustomFormLabel>
                    <CustomTextField
                      id="customerPhone"
                      variant="outlined"
                      fullWidth
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Medical Device Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  For Medical Device Product
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <CustomCheckbox
                          checked={formData.reportableToSFDA}
                          onChange={(e) => handleInputChange('reportableToSFDA', e.target.checked)}
                        />
                      }
                      label="Complaint reportable to SFDA (By Registration team)"
                    />
                    {formData.reportableToSFDA && (
                      <Box sx={{ mt: 1 }}>
                        <CustomFormLabel htmlFor="sfdaReference">Reference</CustomFormLabel>
                        <CustomTextField
                          id="sfdaReference"
                          variant="outlined"
                          fullWidth
                          value={formData.sfdaReference}
                          onChange={(e) => handleInputChange('sfdaReference', e.target.value)}
                        />
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="complaintCategory">Complaint Category</CustomFormLabel>
                    <CustomTextField
                      id="complaintCategory"
                      variant="outlined"
                      fullWidth
                      value={formData.complaintCategory}
                      onChange={(e) => handleInputChange('complaintCategory', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel>Classification of complaint</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={formData.classification}
                        onChange={(e) => handleInputChange('classification', e.target.value)}
                      >
                        {classificationOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<CustomRadio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="qaInvestigation">QA Investigation (Attach investigation report if any)</CustomFormLabel>
                    <CustomTextField
                      id="qaInvestigation"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.qaInvestigation}
                      onChange={(e) => handleInputChange('qaInvestigation', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="safetyConcern">Safety Concern # (if needed) (By pharmacovigilance responsible)</CustomFormLabel>
                    <CustomTextField
                      id="safetyConcern"
                      variant="outlined"
                      fullWidth
                      value={formData.safetyConcern}
                      onChange={(e) => handleInputChange('safetyConcern', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="actionsTaken">Actions Taken (if any)</CustomFormLabel>
                    <CustomTextField
                      id="actionsTaken"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.actionsTaken}
                      onChange={(e) => handleInputChange('actionsTaken', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="capaNumber">CAPA # "If Needed"</CustomFormLabel>
                    <CustomTextField
                      id="capaNumber"
                      variant="outlined"
                      fullWidth
                      value={formData.capaNumber}
                      onChange={(e) => handleInputChange('capaNumber', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="supplierInformed">Inform related supplier on "If needed"</CustomFormLabel>
                    <CustomTextField
                      id="supplierInformed"
                      variant="outlined"
                      fullWidth
                      value={formData.supplierInformed}
                      onChange={(e) => handleInputChange('supplierInformed', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="complaintClosedDate">Complaint closed Date</CustomFormLabel>
                    <DatePicker
                      value={formData.complaintClosedDate}
                      onChange={(newValue) => handleInputChange('complaintClosedDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="customerNotificationDate">Customer Notification Date "If Needed"</CustomFormLabel>
                    <DatePicker
                      value={formData.customerNotificationDate}
                      onChange={(newValue) => handleInputChange('customerNotificationDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <CustomCheckbox
                          checked={formData.productRecall}
                          onChange={(e) => handleInputChange('productRecall', e.target.checked)}
                        />
                      }
                      label="Product Recall"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="finalComment">Final Comment</CustomFormLabel>
                    <CustomTextField
                      id="finalComment"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.finalComment}
                      onChange={(e) => handleInputChange('finalComment', e.target.value)}
                    />
                  </Grid>
                </Grid>
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
                    <CustomFormLabel htmlFor="reportedBy">Reported by: QA Responsible</CustomFormLabel>
                    <CustomTextField
                      id="reportedBy"
                      variant="outlined"
                      fullWidth
                      value={formData.reportedBy}
                      onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="approvedBy">Approved by: QA Manager</CustomFormLabel>
                    <CustomTextField
                      id="approvedBy"
                      variant="outlined"
                      fullWidth
                      value={formData.approvedBy}
                      onChange={(e) => handleInputChange('approvedBy', e.target.value)}
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
                Submit Form
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => setFormData({
                  complaintNo: '',
                  receiptDate: null,
                  receiptTime: '',
                  receivedVia: '',
                  receivedBy: '',
                  receivedBySign: '',
                  complaintSource: '',
                  complainantName: '',
                  location: '',
                  productName: '',
                  batchNo: '',
                  packageSize: '',
                  strength: '',
                  dosageForm: '',
                  mfgDate: null,
                  expDate: null,
                  complaintDescription: '',
                  sampleProvided: false,
                  sampleCount: '',
                  customerEmail: '',
                  customerPhone: '',
                  reportableToSFDA: false,
                  sfdaReference: '',
                  complaintCategory: '',
                  classification: '',
                  qaInvestigation: '',
                  safetyConcern: '',
                  actionsTaken: '',
                  capaNumber: '',
                  supplierInformed: '',
                  complaintClosedDate: null,
                  customerNotificationDate: null,
                  productRecall: false,
                  finalComment: '',
                  reportedBy: '',
                  approvedBy: '',
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

export default CustomerComplaintForm;


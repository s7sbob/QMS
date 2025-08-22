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
  FormControl,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Risk Assessment Follow up',
  },
];

interface RiskFollowUpEntry {
  id: string;
  riskNumber: string;
  riskDescription: string;
  riskImpact: string;
  controlMeasures: string;
  probabilityAfter: string;
  severityAfter: string;
  detectabilityAfter: string;
  riskClassAfter: string;
  riskPriorityAfter: string;
  rpnAfter: string;
  isAccepted: 'yes' | 'no' | '';
  needReassess: 'yes' | 'no' | '';
  reportNumberAccepted: string;
  reportNumberReassess: string;
}

interface RiskFollowUpData {
  riskAssessmentReportNo: string;
  department: string;
  date: Date | null;
  process: string;
  entries: RiskFollowUpEntry[];
  processOwnerName: string;
  processOwnerSignDate: string;
  departmentManagerName: string;
  departmentManagerSignDate: string;
  qaAssociateName: string;
  qaAssociateSignDate: string;
  qaManagerName: string;
  qaManagerSignDate: string;
}

const RiskAssessmentFollowUp: React.FC = () => {
  const [formData, setFormData] = useState<RiskFollowUpData>({
    riskAssessmentReportNo: '',
    department: '',
    date: null,
    process: '',
    entries: [
      {
        id: '1',
        riskNumber: '',
        riskDescription: '',
        riskImpact: '',
        controlMeasures: '',
        probabilityAfter: '',
        severityAfter: '',
        detectabilityAfter: '',
        riskClassAfter: '',
        riskPriorityAfter: '',
        rpnAfter: '',
        isAccepted: '',
        needReassess: '',
        reportNumberAccepted: '',
        reportNumberReassess: '',
      }
    ],
    processOwnerName: '',
    processOwnerSignDate: '',
    departmentManagerName: '',
    departmentManagerSignDate: '',
    qaAssociateName: '',
    qaAssociateSignDate: '',
    qaManagerName: '',
    qaManagerSignDate: '',
  });

  const handleInputChange = (field: keyof RiskFollowUpData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (id: string, field: keyof RiskFollowUpEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addEntry = () => {
    const newId = (formData.entries.length + 1).toString();
    const newEntry: RiskFollowUpEntry = {
      id: newId,
      riskNumber: '',
      riskDescription: '',
      riskImpact: '',
      controlMeasures: '',
      probabilityAfter: '',
      severityAfter: '',
      detectabilityAfter: '',
      riskClassAfter: '',
      riskPriorityAfter: '',
      rpnAfter: '',
      isAccepted: '',
      needReassess: '',
      reportNumberAccepted: '',
      reportNumberReassess: '',
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
    console.log('Risk Assessment Follow Up Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="Risk Assessment Follow up" description="Healthcare Division Risk Assessment Follow up">
      <Breadcrumb title="Risk Assessment Follow up" items={BCrumb} />
      
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code#: QA-SOP-FRM-012.002/03
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="riskAssessmentReportNo">Risk assessment report No.</CustomFormLabel>
              <CustomTextField
                id="riskAssessmentReportNo"
                variant="outlined"
                fullWidth
                value={formData.riskAssessmentReportNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('riskAssessmentReportNo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="department">Department</CustomFormLabel>
              <CustomTextField
                id="department"
                variant="outlined"
                fullWidth
                value={formData.department}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('department', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="process">Process</CustomFormLabel>
              <CustomTextField
                id="process"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.process}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('process', e.target.value)}
              />
            </Grid>
          </Grid>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Risk Follow Up Entries
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
                      <TableCell rowSpan={2} sx={{ minWidth: 80 }}>Risk No.</TableCell>
                      <TableCell rowSpan={2} sx={{ minWidth: 200 }}>Risk Description</TableCell>
                      <TableCell rowSpan={2} sx={{ minWidth: 150 }}>Risk Impact</TableCell>
                      <TableCell rowSpan={2} sx={{ minWidth: 200 }}>Control Measures</TableCell>
                      <TableCell colSpan={6} align="center">Assessment of Risk After Control Measures</TableCell>
                      <TableCell colSpan={2} align="center">Risk follow up</TableCell>
                      <TableCell rowSpan={2} sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ minWidth: 100 }}>Probability No.</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Severity No.</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>Detectability No.</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Risk Class</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Risk Priority</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>RPN No.</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>Is it accepted?</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>Is it need to re-assess?</TableCell>
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
                            multiline
                            rows={2}
                            value={entry.controlMeasures}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'controlMeasures', e.target.value)}
                            placeholder="Control measures"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            value={entry.probabilityAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'probabilityAfter', e.target.value)}
                            placeholder="Prob."
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            value={entry.severityAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'severityAfter', e.target.value)}
                            placeholder="Sev."
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            value={entry.detectabilityAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'detectabilityAfter', e.target.value)}
                            placeholder="Det."
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.riskClassAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskClassAfter', e.target.value)}
                            placeholder="Class"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={entry.riskPriorityAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'riskPriorityAfter', e.target.value)}
                            placeholder="Priority"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            value={entry.rpnAfter}
                            onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'rpnAfter', e.target.value)}
                            placeholder="RPN"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl component="fieldset">
                            <RadioGroup
                              value={entry.isAccepted}
                              onChange={(e) => handleEntryChange(entry.id, 'isAccepted', e.target.value)}
                            >
                              <FormControlLabel value="yes" control={<CustomRadio size="small" />} label="Yes" />
                              <FormControlLabel value="no" control={<CustomRadio size="small" />} label="No" />
                            </RadioGroup>
                          </FormControl>
                          {entry.isAccepted === 'yes' && (
                            <CustomTextField
                              size="small"
                              value={entry.reportNumberAccepted}
                              onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'reportNumberAccepted', e.target.value)}
                              placeholder="If yes, Report #"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <FormControl component="fieldset">
                            <RadioGroup
                              value={entry.needReassess}
                              onChange={(e) => handleEntryChange(entry.id, 'needReassess', e.target.value)}
                            >
                              <FormControlLabel value="yes" control={<CustomRadio size="small" />} label="Yes" />
                              <FormControlLabel value="no" control={<CustomRadio size="small" />} label="No" />
                            </RadioGroup>
                          </FormControl>
                          {entry.needReassess === 'yes' && (
                            <CustomTextField
                              size="small"
                              value={entry.reportNumberReassess}
                              onChange={(e: { target: { value: any; }; }) => handleEntryChange(entry.id, 'reportNumberReassess', e.target.value)}
                              placeholder="If yes, Report #"
                              sx={{ mt: 1 }}
                            />
                          )}
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
                      <TableCell><strong>Process Owner</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.processOwnerName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('processOwnerName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.processOwnerSignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('processOwnerSignDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Department manager</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.departmentManagerName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('departmentManagerName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.departmentManagerSignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('departmentManagerSignDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>QA Associate</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.qaAssociateName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('qaAssociateName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.qaAssociateSignDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('qaAssociateSignDate', e.target.value)}
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
              Save Follow Up
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

export default RiskAssessmentFollowUp;


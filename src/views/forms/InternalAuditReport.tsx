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
  Paper
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
    title: 'Internal Audit Report',
  },
];

interface AuditReportData {
  auditNo: string;
  auditDate: Date | null;
  auditeeDepartment: string;
  auditScope: string;
  auditTeam: string;
  auditObjective: string;
  auditCriteria: string;
  executiveSummary: string;
  findings: {
    id: string;
    finding: string;
    severity: string;
    recommendation: string;
    targetDate: Date | null;
    responsible: string;
  }[];
  conclusion: string;
  auditLeaderName: string;
  auditLeaderSignature: string;
  auditLeaderDate: Date | null;
  managementResponse: string;
  managementName: string;
  managementSignature: string;
  managementDate: Date | null;
}

const InternalAuditReport: React.FC = () => {
  const [formData, setFormData] = useState<AuditReportData>({
    auditNo: '',
    auditDate: null,
    auditeeDepartment: '',
    auditScope: '',
    auditTeam: '',
    auditObjective: '',
    auditCriteria: '',
    executiveSummary: '',
    findings: [
      {
        id: '1',
        finding: '',
        severity: '',
        recommendation: '',
        targetDate: null,
        responsible: ''
      }
    ],
    conclusion: '',
    auditLeaderName: '',
    auditLeaderSignature: '',
    auditLeaderDate: null,
    managementResponse: '',
    managementName: '',
    managementSignature: '',
    managementDate: null
  });

  const handleInputChange = (field: keyof AuditReportData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFindingChange = (index: number, field: string, value: any) => {
    const updatedFindings = [...formData.findings];
    updatedFindings[index] = {
      ...updatedFindings[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      findings: updatedFindings
    }));
  };

  const addFinding = () => {
    const newFinding = {
      id: (formData.findings.length + 1).toString(),
      finding: '',
      severity: '',
      recommendation: '',
      targetDate: null,
      responsible: ''
    };
    setFormData(prev => ({
      ...prev,
      findings: [...prev.findings, newFinding]
    }));
  };

  const removeFinding = (index: number) => {
    if (formData.findings.length > 1) {
      const updatedFindings = formData.findings.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        findings: updatedFindings
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Handle form submission logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer title="Internal Audit Report" description="Internal Audit Report Form">
      <Breadcrumb title="Internal Audit Report" items={BCrumb} />
      
      <ParentCard title="Internal Audit Report">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="auditNo">Audit No.</CustomFormLabel>
              <CustomTextField
                id="auditNo"
                variant="outlined"
                fullWidth
                value={formData.auditNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditNo', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="auditDate">Audit Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.auditDate}
                  onChange={(newValue) => handleInputChange('auditDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="auditeeDepartment">Auditee Department</CustomFormLabel>
              <CustomTextField
                id="auditeeDepartment"
                variant="outlined"
                fullWidth
                value={formData.auditeeDepartment}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditeeDepartment', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="auditScope">Audit Scope</CustomFormLabel>
              <CustomTextField
                id="auditScope"
                variant="outlined"
                fullWidth
                value={formData.auditScope}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditScope', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="auditTeam">Audit Team</CustomFormLabel>
              <CustomTextField
                id="auditTeam"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.auditTeam}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditTeam', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="auditObjective">Audit Objective</CustomFormLabel>
              <CustomTextField
                id="auditObjective"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.auditObjective}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditObjective', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="auditCriteria">Audit Criteria</CustomFormLabel>
              <CustomTextField
                id="auditCriteria"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.auditCriteria}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditCriteria', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="executiveSummary">Executive Summary</CustomFormLabel>
              <CustomTextField
                id="executiveSummary"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.executiveSummary}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('executiveSummary', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Audit Findings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Audit Findings
                </Typography>
                <Button variant="outlined" onClick={addFinding}>
                  Add Finding
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Finding</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Recommendation</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Target Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Responsible</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.findings.map((finding, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={finding.finding}
                            onChange={(e: { target: { value: any; }; }) => handleFindingChange(index, 'finding', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={finding.severity}
                            onChange={(e: { target: { value: any; }; }) => handleFindingChange(index, 'severity', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={finding.recommendation}
                            onChange={(e: { target: { value: any; }; }) => handleFindingChange(index, 'recommendation', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={finding.targetDate}
                              onChange={(newValue) => handleFindingChange(index, 'targetDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            value={finding.responsible}
                            onChange={(e: { target: { value: any; }; }) => handleFindingChange(index, 'responsible', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => removeFinding(index)}
                            disabled={formData.findings.length === 1}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Conclusion and Signatures */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="conclusion">Conclusion</CustomFormLabel>
              <CustomTextField
                id="conclusion"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.conclusion}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('conclusion', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="auditLeaderName">Audit Leader Name</CustomFormLabel>
              <CustomTextField
                id="auditLeaderName"
                variant="outlined"
                fullWidth
                value={formData.auditLeaderName}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditLeaderName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="auditLeaderSignature">Audit Leader Signature</CustomFormLabel>
              <CustomTextField
                id="auditLeaderSignature"
                variant="outlined"
                fullWidth
                value={formData.auditLeaderSignature}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditLeaderSignature', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="auditLeaderDate">Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.auditLeaderDate}
                  onChange={(newValue) => handleInputChange('auditLeaderDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="managementResponse">Management Response</CustomFormLabel>
              <CustomTextField
                id="managementResponse"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.managementResponse}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('managementResponse', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="managementName">Management Name</CustomFormLabel>
              <CustomTextField
                id="managementName"
                variant="outlined"
                fullWidth
                value={formData.managementName}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('managementName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="managementSignature">Management Signature</CustomFormLabel>
              <CustomTextField
                id="managementSignature"
                variant="outlined"
                fullWidth
                value={formData.managementSignature}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('managementSignature', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="managementDate">Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.managementDate}
                  onChange={(newValue) => handleInputChange('managementDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

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

export default InternalAuditReport;


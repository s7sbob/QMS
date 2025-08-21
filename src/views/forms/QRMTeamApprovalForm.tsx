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
  Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'QRM Team Approval Form',
  },
];

interface TeamMember {
  id: string;
  serialNo: string;
  personName: string;
  areaOfExpertise: string;
  signature: string;
}

interface QRMApprovalData {
  riskAnalysisReportNo: string;
  date: Date | null;
  teamMembers: TeamMember[];
  qaManagerName: string;
  qaManagerSignature: string;
  qaManagerDate: Date | null;
}

const QRMTeamApprovalForm: React.FC = () => {
  const [formData, setFormData] = useState<QRMApprovalData>({
    riskAnalysisReportNo: '',
    date: null,
    teamMembers: [
      {
        id: '1',
        serialNo: '1',
        personName: '',
        areaOfExpertise: '',
        signature: '',
      }
    ],
    qaManagerName: '',
    qaManagerSignature: '',
    qaManagerDate: null,
  });

  const handleInputChange = (field: keyof QRMApprovalData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const addTeamMember = () => {
    const newId = (formData.teamMembers.length + 1).toString();
    const newMember: TeamMember = {
      id: newId,
      serialNo: newId,
      personName: '',
      areaOfExpertise: '',
      signature: '',
    };
    
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  const handleSubmit = () => {
    console.log('QRM Team Approval Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="QRM Team Approval Form" description="Healthcare Division QRM Team Approval Form">
      <Breadcrumb title="QRM Team Approval Form" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - QRM Team Approval Form">
        <Box component="form" sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            
            {/* Header Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Report Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="riskAnalysisReportNo">Risk analysis report no</CustomFormLabel>
                    <CustomTextField
                      id="riskAnalysisReportNo"
                      variant="outlined"
                      fullWidth
                      value={formData.riskAnalysisReportNo}
                      onChange={(e) => handleInputChange('riskAnalysisReportNo', e.target.value)}
                      placeholder="-------/-------"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
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
                </Grid>
              </CardContent>
            </Card>

            {/* Team Members Table */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    QRM Team Members
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addTeamMember}
                    size="small"
                  >
                    Add Team Member
                  </Button>
                </Box>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 80 }}>S. No</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Person Name</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Area of Expertise</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Sign</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={member.serialNo}
                              onChange={(e) => handleTeamMemberChange(member.id, 'serialNo', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={member.personName}
                              onChange={(e) => handleTeamMemberChange(member.id, 'personName', e.target.value)}
                              placeholder="Enter person name"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={member.areaOfExpertise}
                              onChange={(e) => handleTeamMemberChange(member.id, 'areaOfExpertise', e.target.value)}
                              placeholder="Enter area of expertise"
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              size="small"
                              value={member.signature}
                              onChange={(e) => handleTeamMemberChange(member.id, 'signature', e.target.value)}
                              placeholder="Signature"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => removeTeamMember(member.id)}
                              disabled={formData.teamMembers.length === 1}
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

            {/* QA Manager Approval */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  QA Manager Approval
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="qaManagerName">Name</CustomFormLabel>
                    <CustomTextField
                      id="qaManagerName"
                      variant="outlined"
                      fullWidth
                      value={formData.qaManagerName}
                      onChange={(e) => handleInputChange('qaManagerName', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="qaManagerSignature">Sign</CustomFormLabel>
                    <CustomTextField
                      id="qaManagerSignature"
                      variant="outlined"
                      fullWidth
                      value={formData.qaManagerSignature}
                      onChange={(e) => handleInputChange('qaManagerSignature', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="qaManagerDate">Date</CustomFormLabel>
                    <DateTimePicker
                      value={formData.qaManagerDate}
                      onChange={(newValue) => handleInputChange('qaManagerDate', newValue)}
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

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
              >
                Submit Approval Form
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => setFormData({
                  riskAnalysisReportNo: '',
                  date: null,
                  teamMembers: [
                    {
                      id: '1',
                      serialNo: '1',
                      personName: '',
                      areaOfExpertise: '',
                      signature: '',
                    }
                  ],
                  qaManagerName: '',
                  qaManagerSignature: '',
                  qaManagerDate: null,
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

export default QRMTeamApprovalForm;


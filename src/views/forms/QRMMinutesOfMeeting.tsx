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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'QRM Minutes of Meeting',
  },
];

interface MeetingMinute {
  id: string;
  serialNumber: string;
  minuteDescription: string;
}

interface MeetingAttendee {
  id: string;
  serialNumber: string;
  personName: string;
  areaOfExpertise: string;
  signature: string;
}

interface QRMMinutesData {
  riskAnalysisReportNo: string;
  date: Date | null;
  minutes: MeetingMinute[];
  attendees: MeetingAttendee[];
}

const QRMMinutesOfMeeting: React.FC = () => {
  const [formData, setFormData] = useState<QRMMinutesData>({
    riskAnalysisReportNo: '',
    date: null,
    minutes: [
      {
        id: '1',
        serialNumber: '1',
        minuteDescription: '',
      }
    ],
    attendees: [
      {
        id: '1',
        serialNumber: '1',
        personName: '',
        areaOfExpertise: '',
        signature: '',
      }
    ],
  });

  const handleInputChange = (field: keyof QRMMinutesData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMinuteChange = (id: string, field: keyof MeetingMinute, value: any) => {
    setFormData(prev => ({
      ...prev,
      minutes: prev.minutes.map(minute =>
        minute.id === id ? { ...minute, [field]: value } : minute
      )
    }));
  };

  const handleAttendeeChange = (id: string, field: keyof MeetingAttendee, value: any) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map(attendee =>
        attendee.id === id ? { ...attendee, [field]: value } : attendee
      )
    }));
  };

  const addMinute = () => {
    const newId = (formData.minutes.length + 1).toString();
    const newMinute: MeetingMinute = {
      id: newId,
      serialNumber: newId,
      minuteDescription: '',
    };
    
    setFormData(prev => ({
      ...prev,
      minutes: [...prev.minutes, newMinute]
    }));
  };

  const removeMinute = (id: string) => {
    setFormData(prev => ({
      ...prev,
      minutes: prev.minutes.filter(minute => minute.id !== id).map((minute, index) => ({
        ...minute,
        serialNumber: (index + 1).toString()
      }))
    }));
  };

  const addAttendee = () => {
    const newId = (formData.attendees.length + 1).toString();
    const newAttendee: MeetingAttendee = {
      id: newId,
      serialNumber: newId,
      personName: '',
      areaOfExpertise: '',
      signature: '',
    };
    
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, newAttendee]
    }));
  };

  const removeAttendee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee.id !== id).map((attendee, index) => ({
        ...attendee,
        serialNumber: (index + 1).toString()
      }))
    }));
  };

  const handleSubmit = () => {
    console.log('QRM Minutes of Meeting Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="QRM Minutes of Meeting" description="Healthcare Division QRM minutes of meeting form">
      <Breadcrumb title="QRM Minutes of Meeting" items={BCrumb} />
      
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code #: QA-SOP-FRM-012.004/02
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="riskAnalysisReportNo">Risk analysis report no</CustomFormLabel>
              <CustomTextField
                id="riskAnalysisReportNo"
                variant="outlined"
                fullWidth
                value={formData.riskAnalysisReportNo}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('riskAnalysisReportNo', e.target.value)}
                placeholder="-------/-------"
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
          </Grid>
          
          {/* Minutes of Meeting Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Minutes of Meeting
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addMinute}
                  size="small"
                >
                  Add Minute
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 80 }}>S. No</TableCell>
                      <TableCell sx={{ minWidth: 400 }}>Minutes of meeting</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.minutes.map((minute) => (
                      <TableRow key={minute.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {minute.serialNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={3}
                            fullWidth
                            value={minute.minuteDescription}
                            onChange={(e: { target: { value: any; }; }) => handleMinuteChange(minute.id, 'minuteDescription', e.target.value)}
                            placeholder="Enter meeting minute details..."
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => removeMinute(minute.id)}
                            disabled={formData.minutes.length === 1}
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

          {/* Attendees Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Meeting Attendees
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addAttendee}
                  size="small"
                >
                  Add Attendee
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 80 }}>S. No</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Person Name</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Area of expertise</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>Sign</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.attendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {attendee.serialNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={attendee.personName}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(attendee.id, 'personName', e.target.value)}
                            placeholder="Enter person name"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={attendee.areaOfExpertise}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(attendee.id, 'areaOfExpertise', e.target.value)}
                            placeholder="Enter area of expertise"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={attendee.signature}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(attendee.id, 'signature', e.target.value)}
                            placeholder="Signature"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => removeAttendee(attendee.id)}
                            disabled={formData.attendees.length === 1}
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              Save Minutes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => setFormData({
                riskAnalysisReportNo: '',
                date: null,
                minutes: [
                  {
                    id: '1',
                    serialNumber: '1',
                    minuteDescription: '',
                  }
                ],
                attendees: [
                  {
                    id: '1',
                    serialNumber: '1',
                    personName: '',
                    areaOfExpertise: '',
                    signature: '',
                  }
                ],
              })}
            >
              Reset Form
            </Button>
          </Stack>

        </Box>
    </PageContainer>
  );
};

export default QRMMinutesOfMeeting;


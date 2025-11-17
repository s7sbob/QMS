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
  Paper,
  Checkbox
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
    title: 'Training Attendance Sheet',
  },
];

interface Attendee {
  id: string;
  employeeName: string;
  department: string;
  signature: string;
  attended: boolean;
}

interface TrainingAttendanceData {
  trainingTitle: string;
  trainingDate: Date | null;
  trainer: string;
  location: string;
  duration: string;
  attendees: Attendee[];
}

const TrainingAttendanceSheet: React.FC = () => {
  const [formData, setFormData] = useState<TrainingAttendanceData>({
    trainingTitle: '',
    trainingDate: null,
    trainer: '',
    location: '',
    duration: '',
    attendees: [
      {
        id: '1',
        employeeName: '',
        department: '',
        signature: '',
        attended: false
      }
    ]
  });

  const handleInputChange = (field: keyof TrainingAttendanceData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttendeeChange = (index: number, field: string, value: any) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index] = {
      ...updatedAttendees[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      attendees: updatedAttendees
    }));
  };

  const addAttendee = () => {
    const newAttendee: Attendee = {
      id: (formData.attendees.length + 1).toString(),
      employeeName: '',
      department: '',
      signature: '',
      attended: false
    };
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, newAttendee]
    }));
  };

  const removeAttendee = (index: number) => {
    if (formData.attendees.length > 1) {
      const updatedAttendees = formData.attendees.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        attendees: updatedAttendees
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
    <PageContainer title="Training Attendance Sheet" description="Training Attendance Sheet">
      <Breadcrumb title="Training Attendance Sheet" items={BCrumb} />
      
      <ParentCard title="Training Attendance Sheet">
        <Box component="form" noValidate>
          {/* Training Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="trainingTitle">Training Title</CustomFormLabel>
              <CustomTextField
                id="trainingTitle"
                variant="outlined"
                fullWidth
                value={formData.trainingTitle}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('trainingTitle', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="trainingDate">Training Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.trainingDate}
                  onChange={(newValue) => handleInputChange('trainingDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="trainer">Trainer</CustomFormLabel>
              <CustomTextField
                id="trainer"
                variant="outlined"
                fullWidth
                value={formData.trainer}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('trainer', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="location">Location</CustomFormLabel>
              <CustomTextField
                id="location"
                variant="outlined"
                fullWidth
                value={formData.location}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="duration">Duration</CustomFormLabel>
              <CustomTextField
                id="duration"
                variant="outlined"
                fullWidth
                value={formData.duration}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('duration', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Attendees List */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Attendees List
                </Typography>
                <Button variant="outlined" onClick={addAttendee}>
                  Add Attendee
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Attended</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.attendees.map((attendee, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={attendee.employeeName}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(index, 'employeeName', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={attendee.department}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(index, 'department', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={attendee.signature}
                            onChange={(e: { target: { value: any; }; }) => handleAttendeeChange(index, 'signature', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={attendee.attended}
                            onChange={(e) => handleAttendeeChange(index, 'attended', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => removeAttendee(index)}
                            disabled={formData.attendees.length === 1}
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

export default TrainingAttendanceSheet;


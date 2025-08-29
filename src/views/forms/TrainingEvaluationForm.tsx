import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Rating,
  FormControl,
  RadioGroup,
  FormControlLabel
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
    title: 'Training Evaluation Form',
  },
];

interface TrainingEvaluationData {
  trainingTitle: string;
  trainingDate: Date | null;
  trainer: string;
  employeeName: string;
  department: string;
  relevanceRating: number | null;
  contentRating: number | null;
  presentationRating: number | null;
  trainerRating: number | null;
  overallRating: number | null;
  learnedNewSkills: string;
  recommendTraining: string;
  strengths: string;
  areasForImprovement: string;
  additionalComments: string;
  evaluationDate: Date | null;
}

const TrainingEvaluationForm: React.FC = () => {
  const [formData, setFormData] = useState<TrainingEvaluationData>({
    trainingTitle: '',
    trainingDate: null,
    trainer: '',
    employeeName: '',
    department: '',
    relevanceRating: 3,
    contentRating: 3,
    presentationRating: 3,
    trainerRating: 3,
    overallRating: 3,
    learnedNewSkills: 'Yes',
    recommendTraining: 'Yes',
    strengths: '',
    areasForImprovement: '',
    additionalComments: '',
    evaluationDate: new Date(),
  });

  const handleInputChange = (field: keyof TrainingEvaluationData, value: any) => {
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
    <PageContainer title="Training Evaluation Form" description="Form for evaluating training sessions">
      <Breadcrumb title="Training Evaluation Form" items={BCrumb} />
      
      <ParentCard title="Training Evaluation Form">
        <Box component="form" noValidate>
          {/* Training Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Training Details
              </Typography>
              
              <Grid container spacing={3}>
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
              </Grid>
            </CardContent>
          </Card>

          {/* Employee Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Employee Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="employeeName">Employee Name</CustomFormLabel>
                  <CustomTextField
                    id="employeeName"
                    variant="outlined"
                    fullWidth
                    value={formData.employeeName}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('employeeName', e.target.value)}
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
              </Grid>
            </CardContent>
          </Card>

          {/* Evaluation Ratings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Evaluation Ratings (1=Poor, 5=Excellent)
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Relevance of the training to your job</CustomFormLabel>
                  <Rating
                    name="relevance-rating"
                    value={formData.relevanceRating}
                    onChange={(_event, newValue) => {
                      handleInputChange('relevanceRating', newValue);
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Quality of the training content</CustomFormLabel>
                  <Rating
                    name="content-rating"
                    value={formData.contentRating}
                    onChange={(_event, newValue) => {
                      handleInputChange('contentRating', newValue);
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Presentation and delivery</CustomFormLabel>
                  <Rating
                    name="presentation-rating"
                    value={formData.presentationRating}
                    onChange={(_event, newValue) => {
                      handleInputChange('presentationRating', newValue);
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Trainer's knowledge and effectiveness</CustomFormLabel>
                  <Rating
                    name="trainer-rating"
                    value={formData.trainerRating}
                    onChange={(_event, newValue) => {
                      handleInputChange('trainerRating', newValue);
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Overall satisfaction with the training</CustomFormLabel>
                  <Rating
                    name="overall-rating"
                    value={formData.overallRating}
                    onChange={(_event, newValue) => {
                      handleInputChange('overallRating', newValue);
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Feedback Questions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Feedback
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel>Did you learn new skills or knowledge?</CustomFormLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      value={formData.learnedNewSkills}
                      onChange={(e) => handleInputChange('learnedNewSkills', e.target.value)}
                    >
                      <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                      <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel>Would you recommend this training to others?</CustomFormLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      value={formData.recommendTraining}
                      onChange={(e) => handleInputChange('recommendTraining', e.target.value)}
                    >
                      <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                      <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="strengths">What were the strengths of the training?</CustomFormLabel>
                  <CustomTextField
                    id="strengths"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.strengths}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('strengths', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="areasForImprovement">What are the areas for improvement?</CustomFormLabel>
                  <CustomTextField
                    id="areasForImprovement"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.areasForImprovement}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('areasForImprovement', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="additionalComments">Additional Comments</CustomFormLabel>
                  <CustomTextField
                    id="additionalComments"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.additionalComments}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('additionalComments', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="evaluationDate">Evaluation Date</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.evaluationDate}
                      onChange={(newValue) => handleInputChange('evaluationDate', newValue)}
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

export default TrainingEvaluationForm;



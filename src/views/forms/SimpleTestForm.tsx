import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack
} from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Simple Test Form',
  },
];

interface TestFormData {
  name: string;
  email: string;
  message: string;
}

const SimpleTestForm: React.FC = () => {
  const [formData, setFormData] = useState<TestFormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (field: keyof TestFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Test Form Data:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <PageContainer title="Simple Test Form" description="Simple Test Form for QMS">
      <Breadcrumb title="Simple Test Form" items={BCrumb} />
      
      <ParentCard title="Simple Test Form">
        <Box component="form" sx={{ mt: 2 }}>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                  <CustomTextField
                    id="name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="message">Message</CustomFormLabel>
                  <CustomTextField
                    id="message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Enter your message"
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
                name: '',
                email: '',
                message: '',
              })}
            >
              Reset Form
            </Button>
          </Stack>

        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default SimpleTestForm;


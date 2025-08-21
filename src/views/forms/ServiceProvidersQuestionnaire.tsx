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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

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
    title: 'Service Providers Questionnaire',
  },
];

interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
}

interface QualitySystemQuestion {
  id: string;
  question: string;
  answer: 'yes' | 'no' | 'na' | '';
  comments: string;
  score: number;
}

interface OperationsQuestion {
  id: string;
  question: string;
  answer: 'yes' | 'no' | 'na' | '';
  comments: string;
  score: number;
}

interface ServiceProviderData {
  // Section A - Service Provider Details
  companyName: string;
  address: string;
  genericEmail: string;
  contactPersons: [ContactPerson, ContactPerson];
  
  // Section B - Quality System
  hasQMS: 'yes' | 'no' | '';
  hasPolicies: 'yes' | 'no' | '';
  qualitySystemDescription: string;
  sfdaAuthorized: 'yes' | 'no' | '';
  sfdaCertificates: string;
  isoCertified: 'yes' | 'no' | '';
  isoCertificates: string;
  hasOrgChart: 'yes' | 'no' | '';
  
  // Policies
  sustainabilityPolicy: 'yes' | 'no' | '';
  codeOfConduct: 'yes' | 'no' | '';
  anticorruption: 'yes' | 'no' | '';
  
  // Personnel Questions
  personnelQuestions: QualitySystemQuestion[];
  
  // Complaints & CAPA Questions
  complaintsQuestions: QualitySystemQuestion[];
  
  // Operations Questions
  operationsQuestions: OperationsQuestion[];
}

const ServiceProvidersQuestionnaire: React.FC = () => {
  const [formData, setFormData] = useState<ServiceProviderData>({
    companyName: '',
    address: '',
    genericEmail: '',
    contactPersons: [
      { name: '', position: '', email: '', phone: '' },
      { name: '', position: '', email: '', phone: '' }
    ],
    hasQMS: '',
    hasPolicies: '',
    qualitySystemDescription: '',
    sfdaAuthorized: '',
    sfdaCertificates: '',
    isoCertified: '',
    isoCertificates: '',
    hasOrgChart: '',
    sustainabilityPolicy: '',
    codeOfConduct: '',
    anticorruption: '',
    personnelQuestions: [
      {
        id: 'personnel_1',
        question: 'Does your Company maintain written procedures and training plan?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'personnel_2',
        question: 'Does your Company maintain current job descriptions defining responsibilities and qualification criteria?',
        answer: '',
        comments: '',
        score: 0
      }
    ],
    complaintsQuestions: [
      {
        id: 'complaints_1',
        question: 'Does your Company have a formal customer complaint system? If Yes, are records maintained on all complaints to include investigations and any corrective actions taken?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'complaints_2',
        question: 'Do you have a procedure describing CAPA management? If Yes, are records maintained on all CAPA to include investigations, any corrective actions, any preventive actions and its effectiveness taken?',
        answer: '',
        comments: '',
        score: 0
      }
    ],
    operationsQuestions: [
      {
        id: 'ops_1',
        question: 'Are all devices clearly identified?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_2',
        question: 'Has the company an established and maintained procedures for traceability of product from purchase to distribution?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_3',
        question: 'Do you have a qualified measuring system, including products traceability by serial numbers and models?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_4',
        question: 'Are devices and equipment kept at required storage condition?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_5',
        question: 'Do you keep inventory log or record indicating equipment name, serial No., quantity, supplier\'s name?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_6',
        question: 'Are rejected devices marked and stored separately in a Secured area?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_7',
        question: 'Do you have procedure for visual examination of devices for damage at the time of receipt?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_8',
        question: 'Is controlled storage conditions maintained as required?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_9',
        question: 'Are devices distribution records maintained?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_10',
        question: 'Do you perform qualification for the used equipment?',
        answer: '',
        comments: '',
        score: 0
      },
      {
        id: 'ops_11',
        question: 'Do you perform re-calibration for the reference devices?',
        answer: '',
        comments: '',
        score: 0
      }
    ]
  });

  const handleInputChange = (field: keyof ServiceProviderData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactPersonChange = (index: number, field: keyof ContactPerson, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactPersons: prev.contactPersons.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      ) as [ContactPerson, ContactPerson]
    }));
  };

  const handleQuestionChange = (
    section: 'personnelQuestions' | 'complaintsQuestions' | 'operationsQuestions',
    id: string,
    field: keyof QualitySystemQuestion,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const calculateSectionScore = (questions: QualitySystemQuestion[]): { total: number; percentage: number } => {
    const maxScore = questions.length * 5;
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    return { total: totalScore, percentage };
  };

  const handleSubmit = () => {
    console.log('Service Provider Questionnaire Data:', formData);
    // Here you would typically send the data to your backend
  };

  const personnelScore = calculateSectionScore(formData.personnelQuestions);
  const complaintsScore = calculateSectionScore(formData.complaintsQuestions);
  const operationsScore = calculateSectionScore(formData.operationsQuestions);
  const sectionBPercentage = (personnelScore.percentage + complaintsScore.percentage) / 2;

  return (
    <PageContainer title="Service Providers Questionnaire" description="Healthcare Division Service Providers Questionnaire">
      <Breadcrumb title="Service Providers Questionnaire" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Service Provider's Questionnaire">
        <Box component="form" sx={{ mt: 2 }}>
          
          {/* Section A - Service Provider Details */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Section A - Service Provider Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="companyName">Company name</CustomFormLabel>
                  <CustomTextField
                    id="companyName"
                    variant="outlined"
                    fullWidth
                    value={formData.companyName}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('companyName', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="address">Address (Site where products are stored)</CustomFormLabel>
                  <CustomTextField
                    id="address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('address', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="genericEmail">Generic e-mail</CustomFormLabel>
                  <CustomTextField
                    id="genericEmail"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={formData.genericEmail}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('genericEmail', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Contact Persons Details</Typography>
                  <Grid container spacing={3}>
                    {formData.contactPersons.map((person, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                              Contact Person {index + 1}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <CustomFormLabel>Name</CustomFormLabel>
                                <CustomTextField
                                  variant="outlined"
                                  fullWidth
                                  value={person.name}
                                  onChange={(e: { target: { value: string; }; }) => handleContactPersonChange(index, 'name', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <CustomFormLabel>Position</CustomFormLabel>
                                <CustomTextField
                                  variant="outlined"
                                  fullWidth
                                  value={person.position}
                                  onChange={(e: { target: { value: string; }; }) => handleContactPersonChange(index, 'position', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <CustomFormLabel>E-mail</CustomFormLabel>
                                <CustomTextField
                                  variant="outlined"
                                  fullWidth
                                  type="email"
                                  value={person.email}
                                  onChange={(e: { target: { value: string; }; }) => handleContactPersonChange(index, 'email', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <CustomFormLabel>Phone Number</CustomFormLabel>
                                <CustomTextField
                                  variant="outlined"
                                  fullWidth
                                  value={person.phone}
                                  onChange={(e: { target: { value: string; }; }) => handleContactPersonChange(index, 'phone', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Section B - Quality System */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Section B - Quality System
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>1.0 Quality System</Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <CustomFormLabel>1. Does your Company have a Quality Management System (QMS)?</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.hasQMS}
                        onChange={(e) => handleInputChange('hasQMS', e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                        <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    
                    {formData.hasQMS === 'no' && (
                      <Box sx={{ mt: 2 }}>
                        <CustomFormLabel>If No, does your Company have policies, systems, procedures and instructions available to your employees?</CustomFormLabel>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={formData.hasPolicies}
                            onChange={(e) => handleInputChange('hasPolicies', e.target.value)}
                          >
                            <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                            <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                        
                        {formData.hasPolicies === 'no' && (
                          <Box sx={{ mt: 2 }}>
                            <CustomFormLabel>If No, please describe your Quality System:</CustomFormLabel>
                            <CustomTextField
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={3}
                              value={formData.qualitySystemDescription}
                              onChange={(e: { target: { value: any; }; }) => handleInputChange('qualitySystemDescription', e.target.value)}
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <CustomFormLabel>2. Is your Company authorized and/or certified by the Saudi FDA?</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.sfdaAuthorized}
                        onChange={(e) => handleInputChange('sfdaAuthorized', e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                        <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    
                    {formData.sfdaAuthorized === 'yes' && (
                      <Box sx={{ mt: 2 }}>
                        <CustomFormLabel>If Yes, please provide a copy of the most recent certificates.</CustomFormLabel>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          value={formData.sfdaCertificates}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('sfdaCertificates', e.target.value)}
                          placeholder="Certificate details or file references"
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <CustomFormLabel>3. Are your company ISO certified?</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.isoCertified}
                        onChange={(e) => handleInputChange('isoCertified', e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                        <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    
                    {formData.isoCertified === 'yes' && (
                      <Box sx={{ mt: 2 }}>
                        <CustomFormLabel>If Yes, please provide a copy of the most recent certificates.</CustomFormLabel>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          value={formData.isoCertificates}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('isoCertificates', e.target.value)}
                          placeholder="Certificate details or file references"
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <CustomFormLabel>4. Is there an organization chart that defines the responsibilities, authorities?</CustomFormLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        value={formData.hasOrgChart}
                        onChange={(e) => handleInputChange('hasOrgChart', e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                        <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <CustomFormLabel>5. Does your Company have any Policies or other documents regarding the following:</CustomFormLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">Sustainability/environment:</Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={formData.sustainabilityPolicy}
                            onChange={(e) => handleInputChange('sustainabilityPolicy', e.target.value)}
                          >
                            <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                            <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">Code of Conduct:</Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={formData.codeOfConduct}
                            onChange={(e) => handleInputChange('codeOfConduct', e.target.value)}
                          >
                            <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                            <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">Anticorruption:</Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={formData.anticorruption}
                            onChange={(e) => handleInputChange('anticorruption', e.target.value)}
                          >
                            <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                            <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                
                {/* Personnel Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>2.0 Personnel</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: 400 }}>Question</TableCell>
                          <TableCell align="center">Yes</TableCell>
                          <TableCell align="center">No</TableCell>
                          <TableCell align="center">N/A</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>Comments</TableCell>
                          <TableCell align="center">Score (1-5)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.personnelQuestions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>{question.question}</TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'yes'}
                                onChange={() => handleQuestionChange('personnelQuestions', question.id, 'answer', 'yes')}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'no'}
                                onChange={() => handleQuestionChange('personnelQuestions', question.id, 'answer', 'no')}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'na'}
                                onChange={() => handleQuestionChange('personnelQuestions', question.id, 'answer', 'na')}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                multiline
                                rows={2}
                                value={question.comments}
                                onChange={(e: { target: { value: any; }; }) => handleQuestionChange('personnelQuestions', question.id, 'comments', e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 5 }}
                                value={question.score}
                                onChange={(e: { target: { value: string; }; }) => handleQuestionChange('personnelQuestions', question.id, 'score', parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                          <TableCell align="center"><strong>{personnelScore.total}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Score Percentage:</strong></TableCell>
                          <TableCell align="center"><strong>{personnelScore.percentage.toFixed(1)}%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                {/* Complaints & CAPA Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>3.0 Complaints & CAPA handling</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: 400 }}>Question</TableCell>
                          <TableCell align="center">Yes</TableCell>
                          <TableCell align="center">No</TableCell>
                          <TableCell align="center">N/A</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>Comments</TableCell>
                          <TableCell align="center">Score (1-5)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.complaintsQuestions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>{question.question}</TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'yes'}
                                onChange={() => handleQuestionChange('complaintsQuestions', question.id, 'answer', 'yes')}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'no'}
                                onChange={() => handleQuestionChange('complaintsQuestions', question.id, 'answer', 'no')}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <CustomRadio
                                checked={question.answer === 'na'}
                                onChange={() => handleQuestionChange('complaintsQuestions', question.id, 'answer', 'na')}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                multiline
                                rows={2}
                                value={question.comments}
                                onChange={(e: { target: { value: any; }; }) => handleQuestionChange('complaintsQuestions', question.id, 'comments', e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 5 }}
                                value={question.score}
                                onChange={(e: { target: { value: string; }; }) => handleQuestionChange('complaintsQuestions', question.id, 'score', parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                          <TableCell align="center"><strong>{complaintsScore.total}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Score Percentage:</strong></TableCell>
                          <TableCell align="center"><strong>{complaintsScore.percentage.toFixed(1)}%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6">
                      Section B Percentage = {sectionBPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Section C - Operations */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Section C - Operations (Temperature qualification, monitoring and calibration service)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                Only one of the below section is applicable
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                1.0 For Temperature qualification, monitoring and calibration service:
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 400 }}>Question</TableCell>
                      <TableCell align="center">Yes</TableCell>
                      <TableCell align="center">No</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Comments</TableCell>
                      <TableCell align="center">Score (1-5)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.operationsQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question}</TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'yes'}
                            onChange={() => handleQuestionChange('operationsQuestions', question.id, 'answer', 'yes')}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'no'}
                            onChange={() => handleQuestionChange('operationsQuestions', question.id, 'answer', 'no')}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'na'}
                            onChange={() => handleQuestionChange('operationsQuestions', question.id, 'answer', 'na')}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={2}
                            value={question.comments}
                            onChange={(e: { target: { value: any; }; }) => handleQuestionChange('operationsQuestions', question.id, 'comments', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={question.score}
                            onChange={(e: { target: { value: string; }; }) => handleQuestionChange('operationsQuestions', question.id, 'score', parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                      <TableCell align="center"><strong>{operationsScore.total}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right"><strong>Section C Percentage:</strong></TableCell>
                      <TableCell align="center"><strong>{operationsScore.percentage.toFixed(1)}%</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              Submit Questionnaire
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
      </ParentCard>
    </PageContainer>
  );
};

export default ServiceProvidersQuestionnaire;


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
  AccordionDetails,
  MenuItem
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';


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

interface PerformanceQuestion {
  id: string;
  question: string;
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
  
  // Section C - Operations (different service types)
  selectedServiceType: string;
  temperatureQualificationQuestions: OperationsQuestion[];
  maintenanceQuestions: OperationsQuestion[];
  destructionQuestions: OperationsQuestion[];
  pestControlQuestions: OperationsQuestion[];
  fireAndSafetyQuestions: OperationsQuestion[];
  generalWasteQuestions: OperationsQuestion[];
  printingQuestions: OperationsQuestion[];
  computerSystemValidationQuestions: OperationsQuestion[];
  
  // Section D - Performance Evaluation
  performanceQuestions: PerformanceQuestion[];
  
  // Final Approval Section
  auditReportCAPAAcceptance: 'yes' | 'no' | 'na';
  finalQualificationStatus: 'qualified_2years' | 'approved_1year' | 'not_accepted' | '';
  
  // Sign-off
  serviceProviderName: string;
  serviceProviderDesignation: string;
  serviceProviderDate: string;
  cigalahQAName: string;
  cigalahQADate: string;
  qaManagerName: string;
  qaManagerDate: string;
  conclusionRecommendations: string;
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
    selectedServiceType: 'temperature_qualification',
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
    temperatureQualificationQuestions: [
      { id: 'temp_1', question: 'Are all devices clearly identified?', answer: '', comments: '', score: 0 },
      { id: 'temp_2', question: 'Has the company an established and maintained procedures for traceability of product from purchase to distribution?', answer: '', comments: '', score: 0 },
      { id: 'temp_3', question: 'Do you have a qualified measuring system, including products traceability by serial numbers and models?', answer: '', comments: '', score: 0 },
      { id: 'temp_4', question: 'Are devices and equipment kept at required storage condition?', answer: '', comments: '', score: 0 },
      { id: 'temp_5', question: 'Do you keep inventory log or record indicating equipment name, serial No., quantity, supplier\'s name?', answer: '', comments: '', score: 0 },
      { id: 'temp_6', question: 'Are rejected devices marked and stored separately in a Secured area?', answer: '', comments: '', score: 0 },
      { id: 'temp_7', question: 'Do you have procedure for visual examination of devices for damage at the time of receipt?', answer: '', comments: '', score: 0 },
      { id: 'temp_8', question: 'Is controlled storage conditions maintained as required?', answer: '', comments: '', score: 0 },
      { id: 'temp_9', question: 'Are devices distribution records maintained?', answer: '', comments: '', score: 0 },
      { id: 'temp_10', question: 'Do you perform qualification for the used equipment?', answer: '', comments: '', score: 0 },
      { id: 'temp_11', question: 'Do you perform re-calibration for the reference devices?', answer: '', comments: '', score: 0 }
    ],
    maintenanceQuestions: [
      { id: 'maint_1', question: 'Has the company established and maintained procedures for traceability of maintenance activities?', answer: '', comments: '', score: 0 },
      { id: 'maint_2', question: 'Are all items stored well?', answer: '', comments: '', score: 0 },
      { id: 'maint_3', question: 'Do you have procedure for visual examination of items for damage at the time of receipt?', answer: '', comments: '', score: 0 },
      { id: 'maint_4', question: 'Is controlled storage conditions maintained as required?', answer: '', comments: '', score: 0 },
      { id: 'maint_5', question: 'Do you perform qualification for the used items?', answer: '', comments: '', score: 0 }
    ],
    destructionQuestions: [
      { id: 'dest_1', question: 'Has the company an established and maintained procedures for traceability of destruction requests, CODs?', answer: '', comments: '', score: 0 },
      { id: 'dest_2', question: 'Do you have a validated computerized system?', answer: '', comments: '', score: 0 },
      { id: 'dest_3', question: 'Do you perform qualification for the used equipment/machines?', answer: '', comments: '', score: 0 },
      { id: 'dest_4', question: 'Do you have a procedure to describe the handling of each type of pharmaceutical products?', answer: '', comments: '', score: 0 },
      { id: 'dest_5', question: 'Do you have a dedicated area for destroying processes?', answer: '', comments: '', score: 0 },
      { id: 'dest_6', question: 'Do you have a procedure for the picking products up and control the goods?', answer: '', comments: '', score: 0 }
    ],
    pestControlQuestions: [
      { id: 'pest_1', question: 'Has the company established and maintained documented procedures for traceability of pest control activities and visit reports?', answer: '', comments: '', score: 0 },
      { id: 'pest_2', question: 'Are products kept at required storage condition?', answer: '', comments: '', score: 0 },
      { id: 'pest_3', question: 'Do you keep inventory log or record indicating material name, Lot No., quantity, supplier\'s name, receiving code and date?', answer: '', comments: '', score: 0 },
      { id: 'pest_4', question: 'Are all materials are approved from the authority and have MSDS?', answer: '', comments: '', score: 0 },
      { id: 'pest_5', question: 'Are materials properly segregated to avoid mix-ups?', answer: '', comments: '', score: 0 },
      { id: 'pest_6', question: 'Do you use stock rotation system (FIFO)?', answer: '', comments: '', score: 0 },
      { id: 'pest_7', question: 'Are rejected materials marked and stored separately in a Secured area?', answer: '', comments: '', score: 0 },
      { id: 'pest_8', question: 'Do you have procedure for visual examination of materials for damage at the time of receipt?', answer: '', comments: '', score: 0 },
      { id: 'pest_9', question: 'Is controlled storage conditions maintained as required?', answer: '', comments: '', score: 0 },
      { id: 'pest_10', question: 'Are devices distribution records maintained?', answer: '', comments: '', score: 0 },
      { id: 'pest_11', question: 'Do you perform qualification for the used materials?', answer: '', comments: '', score: 0 }
    ],
    fireAndSafetyQuestions: [
      { id: 'fire_1', question: 'Has the company established and maintained documented procedures for traceability of visit reports?', answer: '', comments: '', score: 0 },
      { id: 'fire_2', question: 'Are the used detection devices qualified?', answer: '', comments: '', score: 0 },
      { id: 'fire_3', question: 'Do you have procedure for visual examination of devices for damage at the time of receipt?', answer: '', comments: '', score: 0 },
      { id: 'fire_4', question: 'Is controlled storage conditions maintained as required?', answer: '', comments: '', score: 0 },
      { id: 'fire_5', question: 'Are devices distribution records maintained?', answer: '', comments: '', score: 0 },
      { id: 'fire_6', question: 'Do you perform qualification for the used devices/items?', answer: '', comments: '', score: 0 }
    ],
    generalWasteQuestions: [
      { id: 'waste_1', question: 'Do you have the ability to perform the service during all week days?', answer: '', comments: '', score: 0 },
      { id: 'waste_2', question: 'Are the collected wastes handled safely?', answer: '', comments: '', score: 0 },
      { id: 'waste_3', question: 'Are the wastes collected in a dedicated area?', answer: '', comments: '', score: 0 },
      { id: 'waste_4', question: 'Has the company an established and maintained procedures for traceability of requested orders?', answer: '', comments: '', score: 0 }
    ],
    printingQuestions: [
      { id: 'print_1', question: 'Has the company an established and maintained procedures for traceability of requested orders and delivery notes?', answer: '', comments: '', score: 0 },
      { id: 'print_2', question: 'Do you have a procedure for checking the received materials against the requested specifications?', answer: '', comments: '', score: 0 },
      { id: 'print_3', question: 'Do you have a procedure for in-process control and check?', answer: '', comments: '', score: 0 },
      { id: 'print_4', question: 'Do you have a procedure for finished products check after printing?', answer: '', comments: '', score: 0 },
      { id: 'print_5', question: 'Are materials kept at required storage condition?', answer: '', comments: '', score: 0 },
      { id: 'print_6', question: 'Do you have a validated computerized system?', answer: '', comments: '', score: 0 },
      { id: 'print_7', question: 'Do you use stock rotation system (FIFO)?', answer: '', comments: '', score: 0 },
      { id: 'print_8', question: 'Do you have procedure for visual examination of materials for damage at the time of receipt?', answer: '', comments: '', score: 0 },
      { id: 'print_9', question: 'Is controlled storage conditions maintained as required?', answer: '', comments: '', score: 0 },
      { id: 'print_10', question: 'Do you perform qualification for the used materials?', answer: '', comments: '', score: 0 }
    ],
    computerSystemValidationQuestions: [
      { id: 'csv_1', question: 'Does the company complies to 21CFR part 11 regulations or EU GMP Annex 11', answer: '', comments: '', score: 0 },
      { id: 'csv_2', question: 'Does the company use risk based validation approach in line with GAMP 5', answer: '', comments: '', score: 0 },
      { id: 'csv_3', question: 'Access management and system/software security is available', answer: '', comments: '', score: 0 },
      { id: 'csv_4', question: 'Controls in place for audit trails, electronic records & signatures', answer: '', comments: '', score: 0 },
      { id: 'csv_5', question: 'Does the company has a robust back-up and restore process', answer: '', comments: '', score: 0 },
      { id: 'csv_6', question: 'Does the company has data retention process', answer: '', comments: '', score: 0 },
      { id: 'csv_7', question: 'Does the company has contingency strategies in place for delays & system failures', answer: '', comments: '', score: 0 },
      { id: 'csv_8', question: 'Does the company provide post validation support', answer: '', comments: '', score: 0 },
      { id: 'csv_9', question: 'Does the company has process improvement plans in place', answer: '', comments: '', score: 0 },
      { id: 'csv_10', question: 'Maintenance system in place for all hardware used', answer: '', comments: '', score: 0 }
    ],
    performanceQuestions: [
      { id: 'perf_1', question: 'How were the service provider\'s activities performed during the last two years?', comments: '', score: 0 },
      { id: 'perf_2', question: 'How was the response performed during the last two years?', comments: '', score: 0 },
      { id: 'perf_3', question: 'How did the service provider handle the complaints, if any?', comments: '', score: 0 },
      { id: 'perf_4', question: 'Is there any opened complaints or any pended CAPA?', comments: '', score: 0 }
    ],
    auditReportCAPAAcceptance: "na",
    finalQualificationStatus: '',
    serviceProviderName: '',
    serviceProviderDesignation: '',
    serviceProviderDate: '',
    cigalahQAName: '',
    cigalahQADate: '',
    qaManagerName: '',
    qaManagerDate: '',
    conclusionRecommendations: ''
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
    section: 'personnelQuestions' | 'complaintsQuestions' | 'temperatureQualificationQuestions' | 'maintenanceQuestions' | 'destructionQuestions' | 'pestControlQuestions' | 'fireAndSafetyQuestions' | 'generalWasteQuestions' | 'printingQuestions' | 'computerSystemValidationQuestions',
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

  const handlePerformanceQuestionChange = (
    id: string,
    field: keyof PerformanceQuestion,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      performanceQuestions: prev.performanceQuestions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const calculateSectionScore = (questions: QualitySystemQuestion[]): { total: number; percentage: number; maxScore: number } => {
    const maxScore = questions.length * 5;
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    return { total: totalScore, percentage, maxScore };
  };

  const calculatePerformanceScore = (questions: PerformanceQuestion[]): { total: number; percentage: number; maxScore: number } => {
    const maxScore = questions.length * 5;
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    return { total: totalScore, percentage, maxScore };
  };

  const getCurrentOperationsQuestions = () => {
    switch (formData.selectedServiceType) {
      case 'temperature_qualification':
        return formData.temperatureQualificationQuestions;
      case 'maintenance':
        return formData.maintenanceQuestions;
      case 'destruction':
        return formData.destructionQuestions;
      case 'pest_control':
        return formData.pestControlQuestions;
      case 'fire_safety':
        return formData.fireAndSafetyQuestions;
      case 'general_waste':
        return formData.generalWasteQuestions;
      case 'printing':
        return formData.printingQuestions;
      case 'computer_system_validation':
        return formData.computerSystemValidationQuestions;
      default:
        return formData.temperatureQualificationQuestions;
    }
  };

  const getCurrentOperationsSectionName = () => {
    switch (formData.selectedServiceType) {
      case 'temperature_qualification':
        return 'temperatureQualificationQuestions';
      case 'maintenance':
        return 'maintenanceQuestions';
      case 'destruction':
        return 'destructionQuestions';
      case 'pest_control':
        return 'pestControlQuestions';
      case 'fire_safety':
        return 'fireAndSafetyQuestions';
      case 'general_waste':
        return 'generalWasteQuestions';
      case 'printing':
        return 'printingQuestions';
      case 'computer_system_validation':
        return 'computerSystemValidationQuestions';
      default:
        return 'temperatureQualificationQuestions';
    }
  };

  const handleSubmit = () => {
    console.log('Service Provider Questionnaire Data:', formData);
    // Here you would typically send the data to your backend
  };

  const personnelScore = calculateSectionScore(formData.personnelQuestions);
  const complaintsScore = calculateSectionScore(formData.complaintsQuestions);
  const operationsScore = calculateSectionScore(getCurrentOperationsQuestions());
  const performanceScore = calculatePerformanceScore(formData.performanceQuestions);
  
  const sectionBPercentage = (personnelScore.percentage + complaintsScore.percentage) / 2;
  const sectionCPercentage = operationsScore.percentage;
  const sectionDPercentage = performanceScore.percentage;
  const overallQualificationPercentage = (sectionBPercentage + sectionCPercentage + sectionDPercentage) / 3;

  return (
    <PageContainer title="Service Providers Questionnaire" description="Healthcare Division Service Providers Questionnaire">
      <Breadcrumb title="Service Providers Questionnaire" items={BCrumb} />
      
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Code#: QA-SOP-FRM-016.001/06 | Scoring section to be filled by Cigalah only
        </Typography>
        
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
                          multiline
                          rows={2}
                          placeholder="Describe certificates or attach files"
                          value={formData.sfdaCertificates}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('sfdaCertificates', e.target.value)}
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
                          multiline
                          rows={2}
                          placeholder="Describe certificates or attach files"
                          value={formData.isoCertificates}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('isoCertificates', e.target.value)}
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
                                placeholder="To be filled by Cigalah"
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 5 }}
                                value={question.score}
                                onChange={(e: { target: { value: string; }; }) => handleQuestionChange('personnelQuestions', question.id, 'score', parseInt(e.target.value) || 0)}
                                placeholder="1-5"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                          <TableCell align="center"><strong>{personnelScore.total}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Score Percentage = (Total Score/{personnelScore.maxScore})*100:</strong></TableCell>
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
                                placeholder="To be filled by Cigalah"
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 5 }}
                                value={question.score}
                                onChange={(e: { target: { value: string; }; }) => handleQuestionChange('complaintsQuestions', question.id, 'score', parseInt(e.target.value) || 0)}
                                placeholder="1-5"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                          <TableCell align="center"><strong>{complaintsScore.total}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Score Percentage = (Total Score/{complaintsScore.maxScore})*100:</strong></TableCell>
                          <TableCell align="center"><strong>{complaintsScore.percentage.toFixed(1)}%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6">
                      Section B percentage = (Score percentage of 2.0 + Score percentage of 3.0)/2 = {sectionBPercentage.toFixed(1)}%
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
                Section C - Operations
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                Only one of the below section is applicable
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <CustomFormLabel>Select Service Type:</CustomFormLabel>
                <FormControl fullWidth>
                  <CustomSelect
                    value={formData.selectedServiceType}
                    onChange={(e: { target: { value: any; }; }) => handleInputChange('selectedServiceType', e.target.value)}
                  >
                    <MenuItem value="temperature_qualification">1.0 Temperature qualification, monitoring and calibration service</MenuItem>
                    <MenuItem value="maintenance">2.0 Maintenance service</MenuItem>
                    <MenuItem value="destruction">3.0 Destruction service</MenuItem>
                    <MenuItem value="pest_control">4.0 Pest Control service</MenuItem>
                    <MenuItem value="fire_safety">5.0 Fire and safety service</MenuItem>
                    <MenuItem value="general_waste">6.0 General Waste service</MenuItem>
                    <MenuItem value="printing">7.0 Printing service</MenuItem>
                    <MenuItem value="computer_system_validation">8.0 Computer System Validation service</MenuItem>
                  </CustomSelect>
                </FormControl>
              </Box>
              
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
                    {getCurrentOperationsQuestions().map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question}</TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'yes'}
                            onChange={() => handleQuestionChange(getCurrentOperationsSectionName() as any, question.id, 'answer', 'yes')}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'no'}
                            onChange={() => handleQuestionChange(getCurrentOperationsSectionName() as any, question.id, 'answer', 'no')}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomRadio
                            checked={question.answer === 'na'}
                            onChange={() => handleQuestionChange(getCurrentOperationsSectionName() as any, question.id, 'answer', 'na')}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={2}
                            value={question.comments}
                            onChange={(e: { target: { value: any; }; }) => handleQuestionChange(getCurrentOperationsSectionName() as any, question.id, 'comments', e.target.value)}
                            placeholder="To be filled by Cigalah"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={question.score}
                            onChange={(e: { target: { value: string; }; }) => handleQuestionChange(getCurrentOperationsSectionName() as any, question.id, 'score', parseInt(e.target.value) || 0)}
                            placeholder="1-5"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5} align="right"><strong>Total Score:</strong></TableCell>
                      <TableCell align="center"><strong>{operationsScore.total}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right"><strong>Section C Percentage = (Total Score/{operationsScore.maxScore})*100:</strong></TableCell>
                      <TableCell align="center"><strong>{operationsScore.percentage.toFixed(1)}%</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Section D - Performance Evaluation */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Section D - Performance Evaluation
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 400 }}>Question</TableCell>
                      <TableCell sx={{ minWidth: 300 }}>Comments</TableCell>
                      <TableCell align="center">Score (1-5)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.performanceQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question}</TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            multiline
                            rows={3}
                            fullWidth
                            value={question.comments}
                            onChange={(e: { target: { value: any; }; }) => handlePerformanceQuestionChange(question.id, 'comments', e.target.value)}
                            placeholder="To be filled by Cigalah"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={question.score}
                            onChange={(e: { target: { value: string; }; }) => handlePerformanceQuestionChange(question.id, 'score', parseInt(e.target.value) || 0)}
                            placeholder="1-5"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right"><strong>Total Score:</strong></TableCell>
                      <TableCell align="center"><strong>{performanceScore.total}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right"><strong>Score Percentage = (Total Score/{performanceScore.maxScore})*100:</strong></TableCell>
                      <TableCell align="center"><strong>{performanceScore.percentage.toFixed(1)}%</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Final Qualification and Approval Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Final Qualification and Approval
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Service Provider Qualification Percentage
                    </Typography>
                    <Typography variant="body1">
                      (Section B Score percentage + Section C percentage + Section D percentage) / 3 = <strong>{overallQualificationPercentage.toFixed(1)}%</strong>
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel>Audit report CAPA Acceptance along with evidence (By QA Manager Only)</CustomFormLabel>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={formData.auditReportCAPAAcceptance}
                      onChange={(e) => handleInputChange('auditReportCAPAAcceptance', e.target.value)}
                    >
                      <FormControlLabel value="yes" control={<CustomRadio />} label="Yes" />
                      <FormControlLabel value="no" control={<CustomRadio />} label="No" />
                      <FormControlLabel value="na" control={<CustomRadio />} label="N/A" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomFormLabel>Based upon the qualification system the following is the final qualification status for the service provider:</CustomFormLabel>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={formData.finalQualificationStatus}
                      onChange={(e) => handleInputChange('finalQualificationStatus', e.target.value)}
                    >
                      <FormControlLabel value="qualified_2years" control={<CustomRadio />} label="Qualified, re-evaluation in 2 years" />
                      <FormControlLabel value="approved_1year" control={<CustomRadio />} label="Approved & Qualified, needs to be re-evaluated in 1 year" />
                      <FormControlLabel value="not_accepted" control={<CustomRadio />} label="Not Accepted" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Sign-off Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Sign-off
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic' }}>
                I hereby confirm that the information provided in this questionnaire is complete and accurate to the best of my knowledge and ability.
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Signature</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Filled By (Service Provider)</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.serviceProviderName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('serviceProviderName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.serviceProviderDesignation}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('serviceProviderDesignation', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          [Digital Signature]
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.serviceProviderDate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('serviceProviderDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Checked By (Cigalah QA)</strong></TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          value={formData.cigalahQAName}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('cigalahQAName', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>Quality Assurance</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          [Digital Signature]
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          size="small"
                          type="date"
                          value={formData.cigalahQADate}
                          onChange={(e: { target: { value: any; }; }) => handleInputChange('cigalahQADate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3 }}>
                <CustomFormLabel>Quality Assurance Cigalah: Conclusion and recommendations</CustomFormLabel>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.conclusionRecommendations}
                  onChange={(e: { target: { value: any; }; }) => handleInputChange('conclusionRecommendations', e.target.value)}
                  placeholder="Enter conclusion and recommendations..."
                />
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <CustomFormLabel>Final Approval By:</CustomFormLabel>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      variant="outlined"
                      fullWidth
                      placeholder="QA Manager Name"
                      value={formData.qaManagerName}
                      onChange={(e: { target: { value: any; }; }) => handleInputChange('qaManagerName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      variant="outlined"
                      fullWidth
                      type


="date"
                      placeholder="Signature and date"
                      value={formData.qaManagerDate}
                      onChange={(e: { target: { value: any; }; }) => handleInputChange('qaManagerDate', e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Cigalah QA Manager
                </Typography>
              </Box>
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
    </PageContainer>
  );
};

export default ServiceProvidersQuestionnaire;


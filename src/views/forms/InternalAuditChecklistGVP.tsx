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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
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
    title: 'Internal Audit Checklist (GVP)',
  },
];

interface ChecklistItem {
  comply: string;
  notComply: string;
  na: string;
  remarks: string;
}

interface AuditChecklistData {
  auditeeDepartment: string;
  auditDate: Date | null;
  scope: string;
  reference: string;
  auditTeamLeader: string;
  checklistItems: {
    [key: string]: ChecklistItem;
  };
}

const InternalAuditChecklistGVP: React.FC = () => {
  const [formData, setFormData] = useState<AuditChecklistData>({
    auditeeDepartment: '',
    auditDate: null,
    scope: '',
    reference: '',
    auditTeamLeader: '',
    checklistItems: {}
  });

  const auditSections = [
    {
      title: 'Personnel',
      items: [
        'Curriculum Vitae (CV) & Job Description of PV responsible',
        'Training File of PV responsible'
      ]
    },
    {
      title: 'PV System',
      items: [
        'Are Pharmacovigilance Documents (SOPs) for Pharmacovigilance activities reviewed and updated regularly?',
        'Do you routinely monitor incoming information from sources?',
        'Do you perform the reconciliation for PV tasks with MAH?',
        'Do you perform the Quality and regulatory reconciliation periodically?',
        'Do you have written processes (SOPs) for collection, documentation and forwarding of adverse drug reaction-/adverse event-reports in place in your company?',
        'Please give a description on how PV is managed within your organization. Clarify resources and reporting lines (organization Chart)',
        'Do you perform a periodic check on PV reporting channels (email and PV hotline)?',
        'Do you ensure archiving and secure maintenance (back-up) of all PV records (electronic and paper)?'
      ]
    },
    {
      title: 'Training',
      items: [
        'Are all staff (PV and non-PV staff including sales representatives) involved in Pharmacovigilance processes regularly trained on PV and the applicable Quality Documents, including refresher training?',
        'How regularly are Company personnel re-trained in basic Pharmacovigilance (PV)?'
      ]
    },
    {
      title: 'Business Continuity',
      items: [
        'What plan do you have in place to ensure continuity for PV?'
      ]
    },
    {
      title: 'Case Reports Handling',
      items: [
        'What system do you use for tracking Adverse events?',
        'How do you perform follow up of adverse event, please describe the number of follow-up attempts, etc.?',
        'Can you describe what is expected from your HA regarding Individual Case Safety Reports (ICSRs)?'
      ]
    },
    {
      title: 'Inspections',
      items: [
        'Are you aware if your national HA performs inspections of the PV system?',
        'Do you have a system for follow-up on any findings resulting from audits or Health Authority (HA) inspections?',
        'Please state date of last PV inspection by HA',
        'How and how often do you perform monitoring of local legislation?',
        'Can you provide us with the local reporting requirements?'
      ]
    },
    {
      title: 'Local Literature Search',
      items: [
        'Please describe the way you perform Local literature search for Published Adverse Events, including a list of the Journals and their frequency of publishing?'
      ]
    },
    {
      title: 'IT/Safety Data Management',
      items: [
        'Do you have adequate IT systems in place for the exchange of safety information?'
      ]
    },
    {
      title: 'Compliance Monitoring',
      items: [
        'In the last 12 months have there been any late periodical safety reports submitted late to the HA? If so, please describe.',
        'In the last 12 months have there been any late AE reports submitted late to the Supplier? If so, please describe',
        'Do you have a route cause analysis or Corrective and Preventive Action (CAPA) process in place?'
      ]
    },
    {
      title: 'HA Queries',
      items: [
        'Have you been contacted by the HA within past 12 months for a safety/PV related query?'
      ]
    },
    {
      title: 'PV Agreements',
      items: [
        'Do you perform reviews for the PV agreements and how often?'
      ]
    },
    {
      title: 'Additional Pharmacovigilance Requirements',
      items: [
        'Is there a designated Qualified Person for Pharmacovigilance (QPPV) responsible?',
        'Are all adverse events reported within regulatory timelines (15 days for serious, 90 days for non-serious)?',
        'Is there a process for signal detection and evaluation?',
        'Are Periodic Safety Update Reports (PSURs) prepared and submitted on time?',
        'Is there a Risk Management Plan (RMP) in place and regularly updated?',
        'Are all safety variations submitted to regulatory authorities when required?',
        'Is there a process for handling safety communications from regulatory authorities?',
        'Are product information updates made based on new safety information?',
        'Is there a system for monitoring compliance with Risk Minimization Measures?',
        'Are post-authorization safety studies (PASS) conducted when required?'
      ]
    },
    {
      title: 'Quality Management System',
      items: [
        'Is there a Pharmacovigilance System Master File (PSMF) maintained and updated?',
        'Are there written procedures for all pharmacovigilance activities?',
        'Is there a quality management system specific to pharmacovigilance activities?',
        'Are internal audits of the pharmacovigilance system conducted regularly?',
        'Is there a management review process for pharmacovigilance activities?',
        'Are corrective and preventive actions (CAPA) implemented for PV deviations?',
        'Is there a change control process for pharmacovigilance procedures?',
        'Are all pharmacovigilance staff appropriately trained and competent?',
        'Is there a document control system for pharmacovigilance documents?',
        'Are pharmacovigilance records retained for the required period?'
      ]
    },
    {
      title: 'Safety Database Management',
      items: [
        'Is there a validated safety database for case management?',
        'Are all adverse events entered into the safety database in a timely manner?',
        'Is there appropriate access control to the safety database?',
        'Are regular backups of the safety database performed?',
        'Is there a disaster recovery plan for the safety database?',
        'Are data integrity checks performed regularly on the database?',
        'Is there a process for database maintenance and upgrades?',
        'Are audit trails maintained for all database activities?',
        'Is there appropriate training for database users?',
        'Are database validation documents maintained and current?'
      ]
    },
    {
      title: 'International Reporting',
      items: [
        'Are ICSRs reported to international databases (e.g., VigiBase, EudraVigilance)?',
        'Is there compliance with ICH E2B format for electronic reporting?',
        'Are duplicate cases identified and managed appropriately?',
        'Is there a process for handling requests for additional information?',
        'Are follow-up reports submitted when new information is received?',
        'Is there compliance with local reporting requirements in all markets?',
        'Are expedited reports submitted within regulatory timelines?',
        'Is there a process for handling urgent safety restrictions?',
        'Are regulatory acknowledgments tracked and filed?',
        'Is there compliance with pharmacovigilance inspection readiness?'
      ]
    }
  ];

  const handleInputChange = (field: keyof AuditChecklistData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRadioChange = (itemKey: string, column: 'comply' | 'notComply' | 'na', value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemKey]: {
          ...prev.checklistItems[itemKey],
          comply: column === 'comply' ? value : '',
          notComply: column === 'notComply' ? value : '',
          na: column === 'na' ? value : '',
          remarks: prev.checklistItems[itemKey]?.remarks || ''
        }
      }
    }));
  };

  const handleChecklistItemChange = (itemKey: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemKey]: {
          ...prev.checklistItems[itemKey],
          [field]: value
        }
      }
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
    <PageContainer title="Internal Audit Checklist (GVP)" description="Internal Audit Checklist for Good Pharmacovigilance Practices">
      <Breadcrumb title="Internal Audit Checklist (GVP)" items={BCrumb} />
      
      <ParentCard title="Internal Audit Checklist (GVP)">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="auditeeDepartment">Auditee Department / Site</CustomFormLabel>
              <CustomTextField
                id="auditeeDepartment"
                variant="outlined"
                fullWidth
                value={formData.auditeeDepartment}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditeeDepartment', e.target.value)}
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
              <CustomFormLabel htmlFor="scope">Scope</CustomFormLabel>
              <CustomTextField
                id="scope"
                variant="outlined"
                fullWidth
                value={formData.scope}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('scope', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="reference">Reference</CustomFormLabel>
              <CustomTextField
                id="reference"
                variant="outlined"
                fullWidth
                value={formData.reference}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('reference', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="auditTeamLeader">Audit Team Leader</CustomFormLabel>
              <CustomTextField
                id="auditTeamLeader"
                variant="outlined"
                fullWidth
                value={formData.auditTeamLeader}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('auditTeamLeader', e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Audit Checklist Sections */}
          {auditSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {section.title}
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>S.N</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Items to be checked (Requirements)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center' }}>Comply</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center' }}>Not Comply</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center' }}>N/A</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '18%' }}>Remarks/Comments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.items.map((item, itemIndex) => {
                        const itemKey = `${sectionIndex}-${itemIndex}`;
                        return (
                          <TableRow key={itemIndex}>
                            <TableCell sx={{ fontSize: '0.85rem' }}>{itemIndex + 1}</TableCell>
                            <TableCell sx={{ fontSize: '0.85rem' }}>{item}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <FormControl>
                                <RadioGroup
                                  value={formData.checklistItems[itemKey]?.comply || ''}
                                  onChange={(e) => handleRadioChange(itemKey, 'comply', e.target.value)}
                                >
                                  <FormControlLabel
                                    value="yes"
                                    control={<CustomRadio size="small" />}
                                    label=""
                                    sx={{ margin: 0 }}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <FormControl>
                                <RadioGroup
                                  value={formData.checklistItems[itemKey]?.notComply || ''}
                                  onChange={(e) => handleRadioChange(itemKey, 'notComply', e.target.value)}
                                >
                                  <FormControlLabel
                                    value="yes"
                                    control={<CustomRadio size="small" />}
                                    label=""
                                    sx={{ margin: 0 }}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <FormControl>
                                <RadioGroup
                                  value={formData.checklistItems[itemKey]?.na || ''}
                                  onChange={(e) => handleRadioChange(itemKey, 'na', e.target.value)}
                                >
                                  <FormControlLabel
                                    value="yes"
                                    control={<CustomRadio size="small" />}
                                    label=""
                                    sx={{ margin: 0 }}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={1}
                                size="small"
                                value={formData.checklistItems[itemKey]?.remarks || ''}
                                onChange={(e: { target: { value: string; }; }) => handleChecklistItemChange(itemKey, 'remarks', e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
            >
              Submit Audit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handlePrint}
              size="large"
            >
              Print Checklist
            </Button>
          </Stack>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default InternalAuditChecklistGVP;

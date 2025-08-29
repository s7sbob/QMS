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
    title: 'Internal Audit Checklist (HSE)',
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

const InternalAuditChecklistHSE: React.FC = () => {
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
      title: 'HSE System',
      items: [
        'HSE manual and relevant documentations established',
        'Change control system in place for changes to critical processes',
        'Appropriate corrective and preventive actions (CAPA) are taken to correct and prevent the violations'
      ]
    },
    {
      title: 'General',
      items: [
        'The area is tidy and well kept',
        'Adequate storage space is provided',
        'The floor is free of obstructions and not-slippery',
        'Any opening in the floor is guarded or covered',
        'Aisles are sufficiently wide for vehicular traffic',
        'Signs are posted when floors are wet (e.g., when floors are washed, spills)',
        'Stairs kept clear and unobstructed',
        'Walkways and parking lots are free from water, grease, etc.',
        'HSE warning signage in good and catchy condition',
        'Warehouse & equipment Procedure and manuals are updated and available',
        'Warehouse free of food and drink',
        'Shelving of the products and other objects secured correctly and in safe condition',
        'Shelving load weights known and followed',
        'Loading dock edges are marked and guarded',
        'Loading dock gates are closed properly when not in use',
        'Visitors\' rules and instructions are in place',
        'Racks and pallets are in good condition'
      ]
    },
    {
      title: 'Personnel Protective Equipment (PPE)',
      items: [
        'Required PPE available and proper to the tasks',
        'Well maintained and in good condition',
        'Correctly stored after each use',
        'Commitment of all employees to wear them',
        'Periodic inspection to replace damaged personal protective equipment',
        'Training in PPE use and care'
      ]
    },
    {
      title: 'Environments',
      items: [
        'The lighting in the work area allow staff to see their work easily',
        'All light fittings in good working order No flickering lights, etc.',
        'All light bulbs, tubes and lighting covers adequately cleaned',
        'Lighting covers and fittings are secure',
        'Noise level is acceptable/adequately controlled',
        'Ventilation is adequate',
        'General indoor air quality acceptable for the majority of workers, i.e., temperature, humidity, air flow, etc.?',
        'Employees are instructed on how to work in cold environments'
      ]
    },
    {
      title: 'General Facilities',
      items: [
        'Washing facilities (toilet) are clean and functional',
        'Canteen area is clean, hygienic and adequately served',
        'HSE posters and information is displayed',
        'The rubbish Is removed regularly from the facilities such as kitchen, bathroom and offices',
        'The kitchens contain fire extinguishers that are serviceable and accessible',
        'The area around the warehouse clean',
        'Access to the warehouse is clear',
        'The chair/coach are adequate and in good condition'
      ]
    },
    {
      title: 'Emergency Procedures',
      items: [
        'Written procedures posted',
        'Fire extinguishers easily identified and located',
        'Extinguishers of the appropriate type are easily accessible and kept clear',
        'Fire extinguishers had been inspected and tagged within the last six months',
        'There is an automatic extinguishing system, which is inspected periodically by authorized service provider',
        'There are different sequential pumps that operate in emergency situations to activate and support the automatic firefighting system, such as (jockey pump, electric pump, diesel pump)',
        'There is backup lighting and it works properly',
        'Having a backup generator for emergency operation during a power outage',
        'Visitor Emergency Guides are available',
        'Emergency signals and alarms can be clearly heard throughout the warehouse',
        'Emergency exits clearly marked, easy to open and functional',
        'Escape routes are clear and marked',
        'Alarms and signals tested on a regular basis',
        'Emergency exit lights in good condition',
        'There are no obstructions in front of the emergency exit',
        'Has there been an evacuation drill in the last 12 months?',
        'Evacuation drills reviewed and documented'
      ]
    },
    {
      title: 'First Aid Kit',
      items: [
        'First Aid kits easily accessible within 3 to 4 minutes',
        'First Aid kits are stocked and contents are updated',
        'Names and contacts of first aiders assigned and displayed apparently on the designated locations',
        'There is control system of procedures for supplying and inspecting the first aid kit',
        'There is a label on the first aid box describe the quantity of items and the expiry date if exist',
        'First aid kit contents meet the General Organization for Social Insurance standard',
        'Emergency telephone numbers clearly displayed',
        'First aid boxes have been indicated in the emergency layout'
      ]
    },
    {
      title: 'Electrical Safety',
      items: [
        'All cords, plugs and sockets in good condition, i.e., not frayed, exposed, cracked, etc.',
        'Electrical equipment has been inspected, tested and tagged in accordance with company policies and regulations',
        'Battery chargers marked',
        'Power wires/cables are off the floor',
        'Power boards used and not overloaded',
        'Faulty equipment is tagged out',
        'Clear access to electrical panels and no combustible material stored/posted within 24 inches around'
      ]
    },
    {
      title: 'Manual Handling and Ergonomics',
      items: [
        'Power pallet are available for heavy items and loads',
        'Stored items adequately secured and stable',
        'Storage shelves are loaded only to capacity',
        'Work done above 3m follows "Working from Heights" policy and procedures',
        'Workers have been trained on, and they are using, safe lifting techniques which exist in the SOP (HSE-SOP-005 Ergonomics and material handling)',
        'Employees avoiding heavy loads (splitting into smaller loads or asking for help)',
        'When lifting, do employees bend their knees to take pressure off their backs',
        'Sufficient storage is provided',
        'There is a safe equipment for accessing to high shelves',
        'Storage areas are free from rubbish'
      ]
    },
    {
      title: 'Forklifts and Other Equipment',
      items: [
        'The equipment is clean and working properly',
        'All lifting or moving equipment in good condition',
        'Forklift operators are trained',
        'Staff are trained in basic forklift maintenance: recharging the forklift',
        'Provide Adequate refurbished charging stations',
        'The forklift Vehicle safety equipment used correctly (Such as seatbelts)',
        'Start/Stop switches clearly marked and easy to reach',
        'Safe operating procedures available and Lockout procedures available',
        'Defective tools are tagged and removed from service',
        'Manufacturers\' manuals available for all tools and machinery',
        'Planned preventive maintenance is in place for key equipment',
        'Storage equipment in good condition and not overloaded',
        'Adequate records of repair, maintenance and calibration activities for key equipment is made and the results are retained'
      ]
    },
    {
      title: 'Waste Disposal',
      items: [
        'The waste containers are in good condition and appropriate for use',
        'Collect the waste corresponding based on the waste type',
        'Ensured waste containers are emptied regularly',
        'General waste/or Garbage such as: Food remaining, Used paper tissue, Plastic bags, Paper - Collected in a waste pan outside the warehouse, and destructed by contracted local agencies',
        'Material waste: Damaged products - Medicinal products intended to be destroyed are kept separately and handled in accordance with a written procedure (# QA-SOP-017)',
        'Damaged products: Destruction of medicinal products is in accordance with national or international requirements for disposal of such products (# QA-SOP-017)',
        'Damaged products: Records of all destroyed medicinal products are maintained (# QA-SOP-017)',
        'Material waste: Cartons, Broken wooden pallets - Cartons and broken wooden pallets: collected and destructed by contracted local agencies'
      ]
    },
    {
      title: 'Hygiene',
      items: [
        'Procedures relating to personnel hygiene like health, hygiene and clothing are established and observed',
        'Storage of food, drink, smoking materials or medication for personal use in the storage areas is prohibited',
        'Cleaning instructions and records are in place',
        'Premises and storage facilities are clean and free from water and dust',
        'A preventive pest control program is in place'
      ]
    },
    {
      title: 'Additional HSE Requirements',
      items: [
        'HSE Policy is established, documented, implemented and communicated to all personnel',
        'HSE objectives and targets are established and reviewed periodically',
        'Legal and regulatory HSE requirements are identified and compliance is monitored',
        'HSE risk assessments are conducted for all activities and operations',
        'HSE training programs are established and all personnel receive appropriate training',
        'Incident reporting and investigation procedures are in place and followed',
        'HSE performance monitoring and measurement systems are established',
        'Management review of HSE performance is conducted regularly',
        'Contractor HSE management procedures are established and implemented',
        'Emergency response plans and procedures are developed, tested and reviewed'
      ]
    },
    {
      title: 'Environmental Management',
      items: [
        'Environmental aspects and impacts are identified and assessed',
        'Environmental objectives and targets are established',
        'Environmental management programs are developed and implemented',
        'Waste minimization and recycling programs are in place',
        'Air emissions are monitored and controlled',
        'Water usage and discharge are monitored and controlled',
        'Soil and groundwater protection measures are implemented',
        'Noise and vibration levels are monitored and controlled',
        'Chemical storage and handling procedures are established and followed',
        'Environmental emergency response procedures are in place'
      ]
    },
    {
      title: 'Occupational Health',
      items: [
        'Occupational health and medical surveillance programs are established',
        'Health risk assessments are conducted for all job positions',
        'Pre-employment and periodic medical examinations are conducted',
        'Occupational health records are maintained and confidential',
        'Health promotion and wellness programs are implemented',
        'Work-related illness and injury prevention programs are in place',
        'Ergonomic assessments and controls are implemented',
        'Stress management and mental health support programs are available',
        'Health and safety committees are established and functioning',
        'Health surveillance for specific occupational hazards is conducted'
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
    <PageContainer title="Internal Audit Checklist (HSE)" description="Internal Audit Checklist for Health, Safety & Environment">
      <Breadcrumb title="Internal Audit Checklist (HSE)" items={BCrumb} />
      
      <ParentCard title="Internal Audit Checklist (HSE)">
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

export default InternalAuditChecklistHSE;

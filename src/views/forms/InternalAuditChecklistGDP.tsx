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
    title: 'Internal Audit Checklist (GDP)',
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

const InternalAuditChecklistGDP: React.FC = () => {
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
      title: 'Quality System',
      items: [
        'Quality manual or equivalent documentation approach established',
        'Change control system in place for changes to critical processes',
        'Appropriate corrective and preventive actions (CAPA) are taken to correct deviations and prevent them',
        'System for Management Review in place'
      ]
    },
    {
      title: 'Personnel',
      items: [
        'Organizational structure of the distributor is defined in an organizational chart. The responsibility, role and interrelationships of all personnel is clearly indicated',
        'Responsibilities and roles of employees working in key positions is defined in written job descriptions, incl. deputyship arrangements',
        'All personnel involved in wholesale distribution activities is qualified in GDP requirements',
        'Training includes aspects of product identification and avoidance of falsified medicines entering the supply chain',
        'Specific training is provided where indicated (e.g. handling of hazardous products, radioactive materials as well as products presenting special risks of abuse, narcotics or psychotropic substances, or temperature sensitive products)',
        'Personnel receives initial and continuing training relevant to their tasks, based on written standard operating procedures (SOPs) according to a written training program',
        'The practical effectiveness of training is periodically assessed and documented',
        'Responsible Person (RP) appointed',
        'Written job description for Responsible Person (RP) in place',
        'The qualifications of the RP meet the conditions provided by the legislation of the Member State concerned',
        'Responsible Person fulfills obligations according chapter 2.5 of "Guideline on Good Distribution Practice of Medicinal Products for Human Use"'
      ]
    },
    {
      title: 'Premises and Equipment - Outsourcing Activities',
      items: [
        'A contract is in place where premises are not directly operated by the wholesale distributor and the premises are covered by a wholesale distribution authorization'
      ]
    },
    {
      title: 'Premises and Equipment - Layout of Premises',
      items: [
        'Unauthorized access to all areas of the authorized premises is prevented',
        'Receiving and dispatch bays protect products from prevailing weather conditions',
        'Segregated areas are designated for the storage of any product suspected of falsification, returned product, rejected product, product awaiting disposal, recalled product and medicinal products not intended for the EU market',
        'Radioactive materials other hazardous products and products presenting special risks of fire or explosion are stored in a dedicated area(s) with appropriate safety and security measures',
        'There is adequate separation between the receipt and dispatch areas and storage areas',
        'Rest, wash and refreshment rooms for employees are adequately separated from the storage areas'
      ]
    },
    {
      title: 'Hygiene',
      items: [
        'Procedures relating to personnel hygiene like health, hygiene and clothing are established and observed',
        'Storage of food, drink, smoking materials or medication for personal use in the storage areas is prohibited',
        'Cleaning instructions and records are in place',
        'Premises and storage facilities are clean and free from litter and dust',
        'Facilities are designed and equipped so as to afford protection against the entry of insects, rodents or other animals',
        'A preventive pest control program is in place'
      ]
    },
    {
      title: 'Temperature and Environment Control',
      items: [
        'Suitable equipment and procedures are in place to ensure adequate control of the environment',
        'Storage areas are temperature mapped',
        'Temperature monitoring equipment is located according to the results of the mapping exercise',
        'Controls are adequate to maintain all parts of the relevant storage area within defined temperature, humidity or light parameters',
        'Equipment used to control or to monitor the environment, are calibrated and their correct operation and suitability is verified at defined intervals by the appropriate methodology',
        'Appropriate alarm systems are in place to provide alerts when there are deviations from pre-defined storage conditions',
        'Alarm levels are appropriately set',
        'Alarms are regularly tested'
      ]
    },
    {
      title: 'Equipment',
      items: [
        'Planned preventive maintenance is in place for key equipment',
        'Calibration of equipment is traceable to a primary standard',
        'Adequate records of repair, maintenance and calibration activities for key equipment is made and the results are retained',
        'Extent of validation and qualification activities are determined by a documented risk assessment approach and are documented in a plan',
        'Systems are validated/qualified prior to implementation and after any significant changes or upgrades to ensure correct installation and operation',
        'Evidence of satisfactory validation/qualification and acceptance of a process or piece of equipment is produced and approved by appropriate personnel',
        'Re-qualification following repair or maintenance is considered dependent on the scope of the changes made. Such decisions are justified utilizing a risk based approach'
      ]
    },
    {
      title: 'Computer Systems',
      items: [
        'Detailed written descriptions of the systems are available (describing the principles, objectives, security measures and scope of the system and the main features, how the computerized system is used and the way it interacts with other systems)',
        'Data is entered into the computerized system or amended only by persons authorized to do so',
        'Data is secured by physical or electronic means against willful or accidental damage',
        'Data is protected by backing up at regular intervals',
        'Back up data is stored for a period stated in national legislation but at least 5 years at a separate, secure location'
      ]
    },
    {
      title: 'Documentation',
      items: [
        'Documents are retained for a period stated in national legislation but at least 10 years at a separate, secure location'
      ]
    },
    {
      title: 'SOPs',
      items: [
        'SOPs are reviewed regularly and kept up-to-date',
        'SOPs are approved, signed and dated by appropriate authorized persons',
        'Version control is applied to SOPs',
        'Superseded SOP versions are archived',
        'Inadvertent use of the superseded versions is prevented',
        'Superseded or obsolete SOPs are removed from workstations'
      ]
    },
    {
      title: 'Records',
      items: [
        'For any transaction in medicinal products received, supplied or brokered, records are kept either in the form of purchase/sales invoices, delivery slips, or on computer or in any other form',
        'Records include the following information: Date, name of the medicinal product, quantity received/supplied/brokered, name and address of the supplier/broker/consignee as appropriate, batch number where required',
        'Distribution records contain sufficient information on distributors and directly supplied customers (with addresses, phone and/or fax numbers inside and outside working hours, batches and quantities delivered), including those for exported products and medicinal product samples'
      ]
    },
    {
      title: 'Operations',
      items: [
        'All medicinal products distributed have a marketing authorization granted by the EU or by a Member State',
        'For distributors, not being the marketing authorization holder: the marketing authorization holder and the competent authority in the Member State - to which the medicinal product is imported of his intention - is notified of importation',
        'For products being exported: a wholesale distribution authorization or a manufacturing authorization is in place. This is also the case if the exporting wholesale distributor is operating from a free zone'
      ]
    },
    {
      title: 'Supplier Qualification',
      items: [
        'All supplies of medicinal products are obtained only from persons/organizations who are in possession of a wholesale distribution authorization, or who are in possession of a manufacturing authorization which covers the product in question',
        'When medicinal product is obtained from another wholesale distributor: compliance with the principles and guidelines of good distribution practices of the supplying wholesale distributor is verified',
        'When medicinal product is obtained from manufacturer or importer: manufacturer or importer holds a manufacturing authorization',
        'When medicinal product is obtained from a broker: broker is registered and complies with the requirements in Chapter 10 of the Commission Guidelines on Good Distribution Practice of Medicinal Products for Human Use',
        'The purchase of medicinal products is controlled by written procedures',
        'The supply chain of medicinal products is known and documented',
        'Appropriate qualification is performed prior to any procurement',
        'Qualification and approval of suppliers is controlled by a standard operating procedure',
        'The results of qualification and approval of suppliers are documented',
        'The results of qualification and approval of suppliers are periodically rechecked',
        'Qualification and approval of new suppliers: A risk based approach is used considering searches for the new supplier\'s reputation or reliability and its authorized activities, possible target of falsification, large offers of medicinal product which are generally only available in limited quantities, out of range prices'
      ]
    },
    {
      title: 'Qualification of Customers',
      items: [
        'Medicinal products are only supplied to persons/organizations who are themselves in possession of a distribution authorization or who are authorized or entitled to supply medicinal products to the public',
        'Qualification of customers and periodic re-checks include: requesting copies of customer\'s authorizations, verifying status on an authority website, requesting evidence of qualifications or entitlement according to national legislation',
        'Qualification of customers are appropriately documented',
        'Additional Questions which might be asked for verification: Which authorities are relevant to your customer base? How do you check that your customers are bonafide? How regular do you recheck? Pick a customer that you know receives pharma goods and use them as an example. Do you carry out any sales pattern monitoring? How do you ensure that your customers are approved?'
      ]
    },
    {
      title: 'Receipt of Goods',
      items: [
        'When receiving medicinal products from third countries for the purpose of importation: manufacturing/import authorization is in place',
        'It is ensured that the arriving consignment is correct, the medicinal products originate from approved suppliers and have not been damaged or altered during transportation',
        'Medicinal products which require special storage or security measures, are transferred to appropriate storage facilities immediately after appropriate checks have been conducted',
        'In the event of any suspicion of falsified medicinal product, the batch is immediately segregated',
        'In the event of any suspicion of falsified medicinal product, the batch is immediately reported to the national competent authority',
        'In the event of any suspicion of falsified medicinal product, the batch is immediately reported to the marketing authorization holder (where applicable)',
        'Batches of medicinal products intended for the Union market are only transferred to saleable stock before assurance has been obtained that they are authorized and released for sale for the market in question',
        'Incoming containers of medicinal products are cleaned, if necessary, before storage'
      ]
    },
    {
      title: 'Storage',
      items: [
        'Medicinal products are stored separately from other products',
        'Medicinal products are protected from harmful effects of light, temperature, moisture or other external factors',
        'Particular attention is paid to products where specific storage conditions are required',
        'Stock rotation according to the expiry dates of batches of medicinal products is performed ("first expired first out" - FEFO - basis)',
        'Medicinal products beyond their expiry date or shelf life are withdrawn immediately from saleable stock either physically or through other equivalent electronic segregation',
        'Physical removal of unsuitable stock is performed regularly',
        'Medicinal products are not stored directly on the floor',
        'Stock inventories are performed regularly (timings are defined using a risk based approach)',
        'Inventory irregularities are investigated and documented'
      ]
    },
    {
      title: 'Segregation of Goods',
      items: [
        'Segregation is provided for the storage of rejected, expired, recalled or returned products and suspected falsified medicinal products',
        'Any system replacing physical segregation such as electronic segregation based on a computerized system provides equivalent security and is validated'
      ]
    },
    {
      title: 'Destruction of Obsolete Goods',
      items: [
        'Medicinal products intended to be destroyed are kept separately and handled in accordance with a written procedure',
        'Destruction of medicinal products is in accordance with national or international requirements for disposal of such products',
        'Records of all destroyed medicinal products are maintained'
      ]
    },
    {
      title: 'Picking and Packing',
      items: [
        'Controls are in place to ensure the correct product is picked',
        'Products have an appropriate remaining shelf life when picked',
        'Products are picked on a "first expired first out" (FEFO) basis',
        'Packing is adequate to maintain the storage conditions of the product during transport'
      ]
    },
    {
      title: 'Complaints',
      items: [
        'A written procedure is in place for the handling of complaints',
        'Distinction is made between complaints about the quality of a medicinal product and those relating to distribution',
        'In the case of a complaint about the quality of a medicinal product, the manufacturer and/or marketing authorization holder is informed without delay',
        'A person is appointed for handling the complaints with sufficient supporting personnel',
        'Any complaint concerning a potential product defect or a potential falsified product is recorded with all the original details and investigated',
        'The national competent authority is notified without delay in case of a potential product defect or a potential falsified product',
        'Any product distribution complaint is thoroughly investigated',
        'Appropriate follow-up actions are taken after investigation and evaluation of the complaint'
      ]
    },
    {
      title: 'Returned Medicinal Products',
      items: [
        'Written procedures are in place for the handling and acceptance of returned medicinal products',
        'Medicinal products which have left the premises of the distributor are only returned to saleable stock if: the medicinal products are in their unopened and undamaged secondary packaging and in good condition; medicinal products returns from a customer not holding a wholesale distribution are returned within five days of original dispatch; it is demonstrated that the medicinal products have been transported, stored and handled under proper specified/predefined conditions; they have been examined and assessed by a sufficiently trained and competent person authorized to do so; the distributor has reasonable evidence that the product was supplied to that customer; the batch number of the dispatched product is known; a copy of the original delivery note is attached; there is no reason to believe that the product has been falsified; there is evidence that the product has been stored within the authorized storage conditions throughout the entire time',
        'A risk assessment is performed taking into account the product concerned, any specific storage requirements and the time elapsed since the medicinal product was originally dispatched',
        'Returned medicinal products are kept segregated from saleable stock until a decision is taken regarding their disposition',
        'Products returned to saleable stock are placed so that the "first expired first out" (FEFO) system operates effectively',
        'All handling of returned medicinal products including their return to saleable stock or disposal are approved by the Responsible Person and recorded'
      ]
    },
    {
      title: 'Suspected Falsified Medicinal Products',
      items: [
        'The staff is aware of the risks of falsified medicinal products entering the supply chain',
        'A procedure is in place describing immediate information of the competent authority and, where applicable, the marketing authorization holder of the medicinal products they identify as falsified or suspect to be falsified',
        'Any suspected falsified medicinal products found in the supply chain is immediately physically and securely segregated from legitimate medicinal products',
        'All relevant activities are recorded'
      ]
    },
    {
      title: 'Medicinal Product Recalls',
      items: [
        'There is a written procedure for the management of recalls',
        'The management of recalls and its effectiveness is periodically tested and evaluated (Mock Recall)',
        'Any recall operation is recorded at the time it is carried out',
        'The distribution records are readily available to the person(s) responsible for the recall',
        'The progress of a recall process is recorded and a final report issued (including reconciliation between the delivered and recovered quantities of the medicinal products)'
      ]
    },
    {
      title: 'Outsourced Activities',
      items: [
        'Contracts are in place for any GDP-related activity, covering all wholesale distribution activities and clearly establish the duties and responsibilities of each party',
        'Contract acceptor holds a distribution authorization',
        'An audit of the Contract Acceptor is performed before the beginning of the outsourced activities',
        'After the beginning of the outsourced activities audits are done periodically'
      ]
    },
    {
      title: 'Self-Inspections',
      items: [
        'A self-inspection program is implemented to cover all aspects of GDP and compliance within a defined time frame',
        'Self-inspections are conducted in an independent and detailed manner (by designated competent person(s) from the company and independent external experts)',
        'Subcontracted activities are a part of the self-inspection program',
        'Reports contain all observations',
        'Causes of irregularities and/or deficiencies are determined and the CAPA is documented and followed-up'
      ]
    },
    {
      title: 'Transportation - Vehicles and Equipment',
      items: [
        'Required storage conditions are maintained during transportation',
        'Vehicles and equipment are suitable and appropriately equipped to prevent exposure of the products to conditions that could affect their quality and packaging integrity, and to prevent contamination of any kind',
        'Procedures are in place for the operation and maintenance of all vehicles and equipment, including cleaning and safety precautions',
        'Validated temperature-control systems (e.g. thermal packaging, temperature-controlled containers, and refrigerated vehicles) are used to ensure correct transport conditions',
        'If refrigerated vehicles are used temperature mapping is performed under representative conditions including seasonal variations',
        'Equipment used for temperature monitoring during transport within vehicles and/or containers, is maintained and calibrated at regular intervals at least once a year',
        'If cool-packs are used in insulated boxes, they are located such that the product does not come in direct contact with the cool-pack',
        'If cool-packs are used in insulated boxes, staff is trained on the procedures for assembly of the insulated boxes (seasonal configurations) and on the reuse of cool-packs',
        'The process for delivery of sensitive products and control of seasonal temperature variations is described in written procedures',
        'Procedures cover management of unexpected occurrences such as vehicle breakdown or non-delivery',
        'A procedure is in place for investigating and handling temperature excursions',
        'Where non-dedicated vehicles and equipment are used procedures are in place to ensure that the quality of the medicinal product will not be compromised'
      ]
    },
    {
      title: 'Transportation - Delivery',
      items: [
        'Delivery drivers (including contract drivers) are trained in the relevant areas of GDP',
        'Deliveries are made directly to the address stated on the delivery note',
        'Deliveries are handed into the care of the consignee',
        'Deliveries are not left on alternative premises'
      ]
    },
    {
      title: 'Transportation - Transportation Hubs',
      items: [
        'When using transportation hubs, has the maximum time limit for storage in these locations been defined',
        'When using transportation hubs, premises are audited and approved prior to deployment',
        'Is there a specification for transport hubs',
        'Is there a list of Hubs used by the transportation company?'
      ]
    },
    {
      title: 'Transportation - Deviations',
      items: [
        'Deviations are reported to the distributor and recipient',
        'Where necessary in the case of deviations, the manufacturer of the medicinal product is contacted for information about appropriate steps to be taken'
      ]
    },
    {
      title: 'Transportation - Containers, Packaging and Labeling',
      items: [
        'Container and packaging is selected based on: the storage and transportation requirements, the space required for the amount of medicines, the anticipated external temperature extremes, the estimated maximum time for transportation including transit storage at customs, the validation status of the packaging and shipment containers',
        'The containers in which medicinal products are shipped are sealed',
        'A document is enclosed to ascertain the following: Date, name and pharmaceutical form of the medicinal product, batch number at least for products bearing the safety features where required, quantity supplied, name and address of the supplier, name and delivery address of the consignee (actual physical storage premises if different), applicable transport and storage conditions',
        'Containers bear labels providing sufficient information on handling and storage requirements and precautions',
        'Containers bear labels that enable identification'
      ]
    },
    {
      title: 'Transportation of Products Requiring Special Conditions',
      items: [
        'Requirements laid down by the concerned Member States are met',
        'Additional control systems in place',
        'Transportation is performed in safe, dedicated and secure containers and vehicles'
      ]
    },
    {
      title: 'Specific Provisions for Brokers',
      items: [
        'The marketing authorization holder and the competent authority in the Member State - to which the medicinal product is imported of his intention - is notified of importation',
        'The broker is registered',
        'The broker has a permanent address and contact details in the Union under which they are registered',
        'The broker notifies the competent authority of any changes thereof without unnecessary delay',
        'The quality system is defined in writing, approved and kept up-to-date',
        'The quality system sets out the responsibilities, processes and risk management',
        'Personnel involved in brokering activities is trained in the applicable EU and national legislation and in the issues concerning falsified medicinal products',
        'At least the following procedures and instructions are in place: Procedure for complaints handling, Procedure for informing competent authorities and marketing authorization holders of suspected falsified medicinal products, Procedure for supporting recalls, Procedure for ensuring that medicinal products brokered have a marketing authorization, Procedure for verifying that their supplying wholesale distributors hold a distribution authorization, their supplying manufacturers or importers hold a manufacturing authorization and their customers are authorized to supply medicinal products in the Member State concerned',
        'Records are kept for any transaction in medicinal products brokered including at least the following information: Date, name of the medicinal product, quantity brokered, name and address of the supplier and the customer, batch numbers of the medicinal product where required'
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
    <PageContainer title="Internal Audit Checklist (GDP)" description="Internal Audit Checklist for Good Distribution Practice">
      <Breadcrumb title="Internal Audit Checklist (GDP)" items={BCrumb} />
      
      <ParentCard title="Internal Audit Checklist (GDP)">
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

export default InternalAuditChecklistGDP;

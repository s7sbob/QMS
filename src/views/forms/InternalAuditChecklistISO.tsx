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
    title: 'Internal Audit Checklist (ISO)',
  },
];

interface ChecklistItem {
  yes: string;
  no: string;
  na: string;
  comments: string;
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


interface AuditSubsection {
  clause: string;
  title: string;
  items?: string[];
  subsections?: AuditSubsection[];
}

interface AuditSection {
  clause: string;
  title: string;
  items?: string[];
  subsections?: AuditSubsection[];
}

const InternalAuditChecklistISO: React.FC = () => {
  const [formData, setFormData] = useState<AuditChecklistData>({
    auditeeDepartment: '',
    auditDate: null,
    scope: '',
    reference: '',
    auditTeamLeader: '',
    checklistItems: {}
  });

  const auditSections: AuditSection[] = [
    {
      clause: '4',
      title: 'Context of the organization',
      subsections: [
        {
          clause: '4.1',
          title: 'Understanding the organization and its context',
          items: [
            'Has the organization determined external and internal issues that are relevant to its purpose and its strategic direction and that affect its ability to achieve the intended result(s) of its quality management system?',
            'Does the organization monitor and review information about these external and internal issues?',
            'NOTE 1 Issues can include positive and negative factors or conditions for consideration.',
            'NOTE 2 Understanding the external context can be facilitated by considering issues arising from legal, technological, competitive, market, cultural, social and economic environments, whether international, national, regional or local.',
            'NOTE 3 Understanding the internal context can be facilitated by considering issues related to values,'
          ]
        },
        {
          clause: '4.2',
          title: 'Understanding the needs and expectations of interested parties',
          items: [
            'Due to their effect or potential effect on the organization\'s ability to consistently provide products and services that meet customer and applicable statutory and regulatory requirements, has the organization determined:',
            'a) The interested parties that are relevant to the quality management system?',
            'b) The requirements of these interested parties that are relevant to the quality management system?',
            'Does the organization monitor and review information about these interested parties and their relevant requirements?'
          ]
        },
        {
          clause: '4.3',
          title: 'Determining the scope of the quality management system',
          items: [
            'Has the organization determined the boundaries and applicability of the quality management system to establish its scope?',
            'When determining this scope, has the organization shall considered:',
            'a) The external and internal issues referred to in 4.1?',
            'b) The requirements of relevant interested parties referred to in 4.2?',
            'c) The products and services of the organization?',
            'Has the organization applied all the requirements of ISO 9001 if they are applicable within the determined scope of its quality management system?',
            'Is the scope of the organization\'s quality management system available and maintained as documented information?',
            'Does the scope state the types of products and services covered, and provide justification for any requirement of ISO 9001 that the organization determines is not applicable to the scope of its quality management system?',
            'Do any requirements determined by the organization as not being applicable not affect the organization\'s ability or responsibility to ensure the conformity of its products and services and the enhancement of customer satisfaction?'
          ]
        },
        {
          clause: '4.4',
          title: 'Quality management system and its processes',
          subsections: [
            {
              clause: '4.4.1',
              title: 'General',
              items: [
                'Has the organization established, implemented, maintained and continually improved a quality management system, including the processes needed and their interactions, in accordance with the requirements of ISO 9001?',
                'Has the organization determined the processes needed for the quality management system and their application throughout the organization?',
                'Has the organization:',
                'a) Determined the inputs required and the outputs expected from these processes?',
                'b) Determined the sequence and interaction of these processes?',
                'c) Determined and applied the criteria and methods (including monitoring, measurements and related performance indicators) needed to ensure the effective operation and control of these processes?',
                'd) Determined the resources needed for these processes and ensure their availability?',
                'e) Assigned the responsibilities and authorities for these processes?',
                'f) Addressed the risks and opportunities as determined in accordance with the requirements of 6.1?',
                'g) Evaluated these processes and implemented any changes needed to ensure that these processes achieve their intended results?',
                'h) Improved the processes and the quality management system?'
              ]
            },
            {
              clause: '4.4.2',
              title: 'Documented Information',
              items: [
                'To the extent necessary, does the organization:',
                'a) Maintain documented information to support the operation of its processes?',
                'b) Retain documented information to have confidence that the processes are being carried out as planned?'
              ]
            }
          ]
        }
      ]
    },
    {
      clause: '5',
      title: 'Leadership',
      subsections: [
        {
          clause: '5.1',
          title: 'Leadership and commitment',
          subsections: [
            {
              clause: '5.1.1',
              title: 'General',
              items: [
                'Have top management demonstrated leadership and commitment with respect to the quality management system by:',
                'a) Taking accountability for the effectiveness of the quality management system?',
                'b) Ensuring that the quality policy and quality objectives are established for the quality management system and are compatible with the context and strategic direction of the organization?',
                'c) Ensuring the integration of the quality management system requirements into the organization\'s business processes?',
                'd) Promoting the use of the process approach and risk based thinking?',
                'e) Ensuring that the resources needed for the quality management system are available?',
                'f) Communicating the importance of effective quality management and of conforming to the quality management system requirements?',
                'g) Ensuring that the quality management system achieves its intended results?',
                'h) Engaging, directing and supporting persons to contribute to the effectiveness of the quality management system?',
                'i) Promoting improvement?',
                'j) Supporting other relevant management roles to demonstrate their leadership as it applies to their areas of responsibility?',
                'NOTE Reference to "business" in ISO 9001 can be interpreted broadly to mean those activities that are core to the purposes of the organization\'s existence, whether the organization is public, private, for profit or not for profit.'
              ]
            },
            {
              clause: '5.1.2',
              title: 'Customer focus',
              items: [
                'Has top management demonstrated leadership and commitment with respect to customer focus by ensuring that:',
                'a) Customer and applicable statutory and regulatory requirements are determined, understood and consistently met?',
                'b) The risks and opportunities that can affect conformity of products and services and the ability to enhance customer satisfaction are determined and addressed?',
                'c) The focus on enhancing customer satisfaction is maintained?'
              ]
            }
          ]
        },
        {
          clause: '5.2',
          title: 'Policy',
          subsections: [
            {
              clause: '5.2.1',
              title: 'Developing the quality policy',
              items: [
                'Has top management established, implemented and maintained a quality policy that:',
                'a) Is appropriate to the purpose and context of the organization and supports its strategic direction?',
                'b) Provides a framework for setting quality objectives?',
                'c) Includes a commitment to satisfy applicable requirements?',
                'd) Includes a commitment to continual improvement of the quality management system?'
              ]
            },
            {
              clause: '5.2.2',
              title: 'Communicating the quality policy',
              items: [
                'Is the quality policy:',
                'a) Available and maintained as documented information?',
                'b) Communicated, understood and applied within the organization?',
                'c) Available to relevant interested parties, as appropriate?'
              ]
            }
          ]
        },
        {
          clause: '5.3',
          title: 'Organizational roles, responsibilities and authorities',
          items: [
            'Organizational roles, responsibilities and authorities for relevant roles are assigned, communicated and understood within the organization?',
            'Have top management assigned the responsibility and authority for:',
            'a) Ensuring that the quality management system conforms to the requirements of ISO 9001?',
            'b) Ensuring that the processes are delivering their intended outputs?',
            'c) Reporting on the performance of the quality management system and on opportunities for improvement (see 10.1), in particular to top management?',
            'd) Ensuring the promotion of customer focus throughout the organization?',
            'e) Ensuring that the integrity of the quality management system is maintained when changes to the quality management system are planned and implemented?'
          ]
        }
      ]
    },
    {
      clause: '6',
      title: 'Planning',
      subsections: [
        {
          clause: '6.1',
          title: 'Actions to address risks and opportunities',
          subsections: [
            {
              clause: '6.1.1',
              title: 'General',
              items: [
                'When planning for the quality management system, has the organization considered the issues referred to in 4.1 and the requirements referred to in 4.2 and determined the risks and opportunities that need to be addressed to:',
                'a) Give assurance that the quality management system can achieve its intended result(s)?',
                'b) Enhance desirable effects?',
                'c) Prevent, or reduce, undesired effects?',
                'd) Achieve improvement?'
              ]
            },
            {
              clause: '6.1.2',
              title: 'Planning actions',
              items: [
                'Has the organization planned:',
                'a) Actions to address these risks and opportunities?',
                'b) How to:',
                '1) Integrate and implement the actions into its quality management system processes (see 4.4)?',
                '2) Evaluate the effectiveness of these actions?',
                'Are actions taken to address risks and opportunities proportionate to the potential impact on the conformity of products and services?',
                'NOTE 1 Options to address risks can include avoiding risk, taking risk in order to pursue an opportunity, eliminating the risk source, changing the likelihood or consequences, sharing the risk, or retaining risk by informed decision.',
                'NOTE 2 Opportunities can lead to the adoption of new practices, launching new products, opening new markets, addressing new clients, building partnerships, using new technology and other desirable and viable possibilities to address the organization\'s or its customers\' needs.'
              ]
            }
          ]
        },
        {
          clause: '6.2',
          title: 'Quality objectives and planning to achieve them',
          subsections: [
            {
              clause: '6.2.1',
              title: 'Quality objectives',
              items: [
                'Has the organization established quality objectives at relevant functions, levels and processes needed for the quality management system?',
                'Are the quality objectives:',
                'a) Consistent with the quality policy?',
                'b) Measurable?',
                'c) Take into account applicable requirements?',
                'd) Relevant to conformity of products and services and to enhancement of customer satisfaction?',
                'e) Monitored?',
                'f) Communicated?',
                'g) Updated as appropriate?',
                'Does the organization maintain documented information on the quality objectives?'
              ]
            },
            {
              clause: '6.2.2',
              title: 'Planning to achieve quality objectives',
              items: [
                'When planning how to achieve its quality objectives, has the organization determined:',
                'a) What will be done?',
                'b) What resources will be required?',
                'c) Who will be responsible?',
                'd) When it will be completed?',
                'e) How the results will be evaluated?'
              ]
            }
          ]
        },
        {
          clause: '6.3',
          title: 'Planning of changes',
          items: [
            'When the organization determines the need for change to the quality management system (see 4.4) are changes carried out in a planned and systematic manner?',
            'Does the organization consider:',
            'a) The purpose of the change and any of its potential consequences?',
            'b) The integrity of the quality management system?',
            'c) The availability of resources?',
            'd) The allocation or reallocation of responsibilities and authorities?'
          ]
        }
      ]
    },
    {
      clause: '7',
      title: 'Support',
      subsections: [
        {
          clause: '7.1',
          title: 'Resources',
          subsections: [
            {
              clause: '7.1.1',
              title: 'General',
              items: [
                'Has the organization determined and provided the resources needed for the establishment, implementation, maintenance and continual improvement of the quality management system?',
                'Has the organization considered:',
                'a) The capabilities of, and constraints on, existing internal resources?',
                'b) What needs to be obtained from external providers?'
              ]
            },
            {
              clause: '7.1.2',
              title: 'People',
              items: [
                'Has the organization determined and provided the persons necessary for the effective implementation of its quality management system and for the operation and control of its processes?'
              ]
            },
            {
              clause: '7.1.3',
              title: 'Infrastructure',
              items: [
                'Has the organization determined, provided and maintained the infrastructure necessary for the operation of its processes to achieve conformity of products and services?',
                'NOTE Infrastructure can include:',
                'a) buildings and associated utilities;',
                'b) equipment, including hardware and software;',
                'c) transportation resources;',
                'd) Information and communication technology.'
              ]
            },
            {
              clause: '7.1.4',
              title: 'Environment for the operation of processes',
              items: [
                'Has the organization determined, provided and maintained the environment necessary for the operation of its processes and to achieve conformity of products and services?',
                'NOTE A suitable environment can be a combination of human and physical factors, such as:',
                'a) social (e.g. non-discriminatory, calm, non-confrontational);',
                'b) psychological (e.g. stress-reducing, burnout prevention, emotionally protective);',
                'c) Physical (e.g. temperature, heat, humidity, light, airflow, hygiene, noise). These factors can differ substantially depending on the products and services provided.'
              ]
            },
            {
              clause: '7.1.5',
              title: 'Monitoring and measuring resources',
              subsections: [
                {
                  clause: '7.1.5.1',
                  title: 'General',
                  items: [
                    'When monitoring or measuring is used to verify the conformity of products and services to specified, has the organization determined and provided the resources needed to ensure valid and reliable results?',
                    'Does the organization ensure that the resources provided:',
                    'a) Are suitable for the specific type of monitoring and measurement activities being undertaken?',
                    'b) Are maintained to ensure their continued fitness for their purpose.',
                    'Does the organization retain appropriate documented information as evidence of fitness for purpose of monitoring and measurement resources?'
                  ]
                },
                {
                  clause: '7.1.5.2',
                  title: 'Measurement traceability',
                  items: [
                    'When measurement traceability is a requirement, or is considered by the organization to be an essential part of providing confidence in the validity of measurement results, is measuring equipment:',
                    'a) Calibrated or verified, or both, at specified intervals, or prior to use, against measurement standards traceable to international or national measurement standards?',
                    'When no such standards exist, is the basis used for calibration or verification retained as documented information?',
                    'b) Identified in order to determine its status?',
                    'c) Safeguarded from adjustments, damage or deterioration that would invalidate the calibration status and subsequent measurement results?',
                    'Does the organization determine if the validity of previous measurement results has been adversely affected when measuring equipment is found to be unfit for its intended purpose, and shall take appropriate action as necessary?'
                  ]
                }
              ]
            },
            {
              clause: '7.1.6',
              title: 'Organizational knowledge',
              items: [
                'Does the organization determine the knowledge necessary for the operation of its processes and to achieve conformity of products and services?',
                'Is this knowledge maintained and made available to the extent necessary?',
                'When addressing changing needs and trends, does the organization consider its current knowledge and determine how to acquire or access the necessary additional knowledge and required updates?',
                'NOTE 1 Organizational knowledge is knowledge specific to the organization; it is gained by experience. It is information that is used and shared to achieve the organization\'s objectives.',
                'NOTE 2 Organizational knowledge can be based on: a) internal sources (e.g. intellectual property; knowledge gained from experience; lessons learned from failures and successful projects; capturing and sharing undocumented knowledge and experience; the results of improvements in processes, products and services); b) external sources (e.g. standards; academia; conferences; gathering knowledge from customers or external providers).'
              ]
            }
          ]
        },
        {
          clause: '7.2',
          title: 'Competence',
          items: [
            'Has the organization:',
            'a) Determined the necessary competence of person(s) doing work under its control that affects the performance and effectiveness of the quality management system?',
            'b) Ensured that these persons are competent on the basis of appropriate education, training, or experience?',
            'c) Taken actions, where applicable, to acquire the necessary competence and evaluated the effectiveness of the actions taken?',
            'd) Retained appropriate documented information as evidence of competence?',
            'NOTE Applicable \'actions\' can include, for example, the provision of training to, the mentoring of, or the reassignment of currently employed persons; or the hiring or contracting of competent persons.'
          ]
        },
        {
          clause: '7.3',
          title: 'Awareness',
          items: [
            'Has the organization ensured that persons doing work under its control are aware of:',
            'a) The quality policy?',
            'b) Relevant quality objectives?',
            'c) Their contribution to the effectiveness of the quality management system, including the benefits of improved quality performance?',
            'd) The implications of not conforming with the quality management system requirements?'
          ]
        },
        {
          clause: '7.4',
          title: 'Communication',
          items: [
            'Has the organization determined the internal and external communications relevant to the quality management system including:',
            'a) On what it will communicate?',
            'b) When to communicate?',
            'c) With whom to communicate?',
            'd) How to communicate?',
            'e) Who communicates?'
          ]
        },
        {
          clause: '7.5',
          title: 'Documented Information',
          subsections: [
            {
              clause: '7.5.1',
              title: 'General',
              items: [
                'Does the organization\'s quality management system include:',
                'a) Documented information required by ISO 9001?',
                'b) Documented information determined by the organization as being necessary for the effectiveness of the quality management system?'
              ]
            },
            {
              clause: '7.5.2',
              title: 'Creating and updating',
              items: [
                'When creating and updating documented information, does the organization ensure appropriate:',
                'a) Identification and description (e.g. a title, date, author, or reference number)?',
                'b) Format (e.g. language, software version, graphics) and media (e.g. paper, electronic)?',
                'c) Review and approval for suitability and adequacy?'
              ]
            },
            {
              clause: '7.5.3',
              title: 'Control of documented information',
              subsections: [
                {
                  clause: '7.5.3.1',
                  title: 'General Control',
                  items: [
                    'Is the documented information required by the quality management system and by ISO 9001 controlled to ensure:',
                    'a) It is available and suitable for use, where and when it is needed?',
                    'b) It is adequately protected (e.g. from loss of confidentiality, improper use, or loss of integrity)?'
                  ]
                },
                {
                  clause: '7.5.3.2',
                  title: 'Control Activities',
                  items: [
                    'For the control of documented information, has the organization shall addressed the following activities, as applicable:',
                    'a) Distribution, access, retrieval and use?',
                    'b) Storage and preservation, including preservation of legibility?',
                    'c) Control of changes (e.g. version control)?',
                    'd) Retention and disposition?',
                    'Is documented information of external origin, determined by the organization to be necessary for the planning and operation of the quality management system, identified as appropriate and controlled?',
                    'Is documented information retained as evidence of conformity protected from unintended alterations?',
                    'NOTE \'Access\' can imply a decision regarding the permission to view the documented information only, or the permission and authority to view and change the documented information.'
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      clause: '8',
      title: 'Operation',
      subsections: [
        {
          clause: '8.1',
          title: 'Operational planning and control',
          items: [
            'Does the organization plan, implement and control the processes (see 4.4) needed to meet the requirements for the provision of products and services and to implement the actions determined in 6, by:',
            'a) Determining requirements for the product and services;',
            'b) Establishing criteria for:',
            '1) The processes?',
            '2) The acceptance of products and services?',
            'c) Determining the resources needed to achieve conformity to product and service requirements?',
            'd) Implementing control of the processes in accordance with the criteria?',
            'e) Determining, maintaining and retaining documented information to the extent necessary:',
            '1) To have confidence that the processes have been carried out as planned?',
            '2) To demonstrate conformity of products and services to their requirements?',
            'Is the output of this planning suitable for the organization\'s operations?',
            'Does the organization control planned changes and review the consequences of unintended changes, taking action to mitigate any adverse effects, as necessary?',
            'Does the organization ensure that outsourced processes are controlled in accordance with 8.4?'
          ]
        },
        {
          clause: '8.2',
          title: 'Requirements for products and services',
          subsections: [
            {
              clause: '8.2.1',
              title: 'Customer communication',
              items: [
                'Does customer communication include:',
                'a) Providing information relating to products and services?',
                'b) Handling enquiries, contracts or order handling, including changes?',
                'c) Obtaining customer feedback relating to products and services, including customer complaints?',
                'd) The handling or controlling customer property?',
                'e) Establishing specific requirements for contingency actions, when relevant?'
              ]
            },
            {
              clause: '8.2.2',
              title: 'Determination of requirements related to products and services',
              items: [
                'When determining the requirements for the products and services to be offered to customers, does the organization ensure that:',
                'a) The requirements for products and services are defined, including:',
                '1) Any applicable statutory and regulatory requirements?',
                '2) Those considered necessary by the organization?',
                'b) The organization can meet the claims for the products and services it offers?'
              ]
            },
            {
              clause: '8.2.3',
              title: 'Review of requirements related to products and services',
              subsections: [
                {
                  clause: '8.2.3.1',
                  title: 'General Review',
                  items: [
                    'Does the organization ensure that it has the ability to meet the requirements for products and services to be offered to customers?',
                    'Does the organization conduct a review before committing to supply products and services, including:',
                    'a) Requirements specified by the customer, including the requirements for delivery and post-delivery activities?',
                    'b) Requirements not stated by the customer, but necessary for the specified or intended use, when known?',
                    'c) Requirements specified by the organization?',
                    'd) Statutory and regulatory requirements applicable to the products and services?',
                    'e) Contract or order requirements differing from those previously expressed?',
                    'Does the organization ensure that contract or order requirements differing from those previously defined are resolved?',
                    'When the customer does not provide a documented statement of their requirements, are the customer requirements confirmed by the organization before acceptance?',
                    'NOTE In some situations, such as internet sales, a formal review is impractical for each order. Instead, the review can cover relevant product information, such as catalogues.',
                    'Does the organization retain documented information, as applicable:',
                    'a) On the results of the review?',
                    'b) On any new requirements for the products and services?'
                  ]
                }
              ]
            },
            {
              clause: '8.2.4',
              title: 'Changes to requirements for products and services',
              items: [
                'Does the organization ensure that relevant documented information is amended, and that relevant persons are made aware of the changed requirements, when the requirements for products and services are changed?'
              ]
            }
          ]
        },
        {
          clause: '8.3',
          title: 'Design and development of products and services',
          subsections: [
            {
              clause: '8.3.1',
              title: 'General',
              items: [
                'Has the organization established, implemented and maintained a design and development process that is appropriate to ensure the subsequent provision of products and services.'
              ]
            },
            {
              clause: '8.3.2',
              title: 'Design and development planning',
              items: [
                'In determining the stages and controls for design and development, does the organization consider:',
                'a) The nature, duration and complexity of the design and development activities?',
                'b) The required process stages, including applicable design and development reviews?',
                'c) The required design and development verification and validation activities?',
                'd) The responsibilities and authorities involved in the design and development process?',
                'e) The internal and external resource needs for the design and development of products and services?',
                'f) The need to control interfaces between persons involved in the design and development process?',
                'g) The need for involvement of customers and users in the design and development process?',
                'h) The requirements for subsequent provision of products and services?',
                'i) The level of control expected for the design and development process by customers and other relevant interested parties?',
                'j) The documented information needed to demonstrate that design and development requirements have been met?'
              ]
            },
            {
              clause: '8.3.3',
              title: 'Design and development inputs',
              items: [
                'Does the organization determine the requirements essential for the specific types of products and services to be designed and developed?',
                'Does the organization consider:',
                'a) Functional and performance requirements?',
                'b) Information derived from previous similar design and development activities?',
                'c) Statutory and regulatory requirements?',
                'd) Standards or codes of practice that the organization has committed to implement?',
                'e) The potential consequences of failure due to the nature of the products and services?',
                'Are inputs adequate for design and development purposes, complete and unambiguous?',
                'Are conflicting design and development inputs resolved?',
                'Does the organization retain documented information on design and development inputs?'
              ]
            },
            {
              clause: '8.3.4',
              title: 'Design and development controls',
              items: [
                'Does the organization apply controls to the design and development process to ensure that:',
                'a) The results to be achieved are defined?',
                'b) Reviews are conducted to evaluate the ability of the results of design and development to meet requirements?',
                'c) Verification activities are conducted to ensure that the design and development outputs meet the input requirements?',
                'd) Validation activities are conducted to ensure that the resulting products and services meet the requirements for the specified application or intended use?',
                'e) Any necessary actions are taken on problems determined during the reviews, or verification and validation activities?',
                'f) Documented information of these activities is retained?',
                'NOTE Design and development reviews, verification and validation have distinct purposes. They can be conducted separately or in any combination, as is suitable for the products and services of the organization.'
              ]
            },
            {
              clause: '8.3.5',
              title: 'Design and development outputs',
              items: [
                'Does the organization ensure that design and development outputs:',
                'a) Meet the input requirements?',
                'b) Are adequate for the subsequent processes for the provision of products and services?',
                'c) Include or reference monitoring and measuring requirements, as appropriate, and acceptance criteria?',
                'd) Specify the characteristics of the products and services that are essential for their intended purpose and their safe and proper provision?',
                'Does the organization retain documented information on design and development process?'
              ]
            },
            {
              clause: '8.3.6',
              title: 'Design and development changes',
              items: [
                'Does the organization identify, review and control changes made during, or subsequent to, the design and development of products and services, to the extent necessary to ensure that there is no adverse impact on conformity to requirements?',
                'Does the organization retain documented information on:',
                'a) Design and development changes?',
                'b) The results of reviews?',
                'c) The authorization of the changes',
                'd) The actions taken to prevent adverse impacts?'
              ]
            }
          ]
        },
        {
          clause: '8.4',
          title: 'Control of externally provided products and services',
          subsections: [
            {
              clause: '8.4.1',
              title: 'General',
              items: [
                'Does the organization ensure that externally provided processes, products and services conform to requirements?',
                'Does the organization determine the controls to be applied to externally provided, processes, products and services when:',
                'a) Products and services from external providers are intended for incorporation into the organization\'s own products and services?',
                'b) Products and services are provided directly to the customer(s) by external providers on behalf of the organization?',
                'c) A process, or part of a process, is provided by an external provider as a result of a decision by the organization?',
                'Has the organization determined and applied criteria for the evaluation, selection, monitoring of performance and re- evaluation of external providers, based on their ability to provide processes or products and services in accordance with requirements?',
                'Does the organization retain documented information of these activities and any necessary actions arising from the evaluations?'
              ]
            },
            {
              clause: '8.4.2',
              title: 'Type and extent of control of external provision',
              items: [
                'Does the organization ensure that externally provided processes, products and services do not adversely affect the organization\'s ability to consistently deliver conforming products and services to its customers?',
                'Does the organization:',
                'a) Ensure that externally provided processes remain within the control of its quality management system?',
                'b) Define both the controls that it intends to apply to an external provider and those it intends to apply to the resulting output?',
                'c) Take into consideration:',
                '1) The potential impact of the externally provided processes, products and services on the organization\'s ability to consistently meet customer and applicable statutory and regulatory requirements?',
                '2) The effectiveness of the controls applied by the external provider',
                'd) Determine the verification, or other activities, necessary to ensure that the externally provided processes, products and services meet requirements?'
              ]
            },
            {
              clause: '8.4.3',
              title: 'Information for external providers',
              items: [
                'Does the organization ensure the adequacy of requirements prior to their communication to the external provider?',
                'Does the organization communicate to external providers its requirements for:',
                'a) The processes, products and services to be provided?',
                'b) The approval of:',
                '1) Products and services?',
                '2) Methods, processes and equipment?',
                '3) The release of products and services?',
                'c) Competence, including any required qualification of persons?',
                'd) The external providers\' interactions with the organization?',
                'e) Control and monitoring of the external provider\'s performance to be applied by the organization?',
                'f) Verification or validation activities that the organization, or its customer, intends to perform at the external provider\'s premises?'
              ]
            }
          ]
        },
        {
          clause: '8.5',
          title: 'Production and service provision',
          subsections: [
            {
              clause: '8.5.1',
              title: 'Control of production and service provision',
              items: [
                'Has the organization implemented production and service provision under controlled conditions?',
                'Do those controlled conditions include, as applicable:',
                'a) The availability of documented information that defines:',
                '1) The characteristics of the products to be produced, the services to be provided, or the activities to be performed?',
                '2) The results to be achieved?',
                'b) The availability and use of suitable monitoring and measuring resources?',
                'c) The implementation of monitoring and measurement activities at appropriate stages to verify that criteria for control of processes or outputs, and acceptance criteria for products and services, have been met?',
                'd) The use of suitable infrastructure and environment for the operation of processes?',
                'e) The appointment of competent persons, including any required qualification?',
                'f) The validation, and periodic revalidation, of the ability to achieve planned results of the processes for production and service provision where the resulting output cannot be verified by subsequent monitoring or measurement?',
                'g) The implementations of actions to prevent human error?',
                'h) The implementation of release, delivery and post-delivery activities?'
              ]
            },
            {
              clause: '8.5.2',
              title: 'Identification and traceability',
              items: [
                'Does the organization use suitable means to identify outputs when it is necessary to ensure the conformity of products and services?',
                'Does the organization identify the status of process outputs with respect to monitoring and measurement requirements throughout production and service provision?',
                'When traceability is a requirement, does the organization control the unique identification of the outputs and retain any documented information necessary to enable traceability?'
              ]
            },
            {
              clause: '8.5.3',
              title: 'Property belonging to customers or external providers',
              items: [
                'Does the organization exercise care with property belonging to the customer or external providers while it is under the organization\'s control or being used by the organization?',
                'Does the organization identify, verify, protect and safeguard the customer\'s or external provider\'s property provided for use or incorporation into the products and services?',
                'When the property of a customer or external provider is lost, damaged or otherwise found to be unsuitable for use, does the organization report this to the customer or external provider and retain documented information on what has occurred?',
                'NOTE A customer\'s or external provider\'s property can include material, components, tools and equipment, premises, intellectual property and personal data'
              ]
            },
            {
              clause: '8.5.4',
              title: 'Preservation',
              items: [
                'Does the organization preserve the outputs during production and service provision, to the extent necessary to ensure conformity to requirements?',
                'NOTE Preservation can include identification, handling, contamination control, packaging, storage, transmission or transportation, and protection.'
              ]
            },
            {
              clause: '8.5.5',
              title: 'Post-delivery activities',
              items: [
                'Does the organization meet requirements for post-delivery activities associated with the products and services?',
                'In determining the extent of post-delivery activities that are required, does the organization consider:',
                'a) Statutory and regulatory requirements?',
                'b) The potential undesired consequences associated with its products and services?',
                'c) The nature, use and intended lifetime of the products and services?',
                'd) Customer requirements?',
                'e) Customer feedback?',
                'NOTE Post-delivery activities can include actions under warranty provisions, contractual obligations such as maintenance services, and supplementary services such as recycling or final disposal.'
              ]
            },
            {
              clause: '8.5.6',
              title: 'Control of changes',
              items: [
                'Does the organization review and control changes for production or service provision, to the extent necessary to ensure continuing conformity with requirements?',
                'Does the organization retain documented information describing the results of the review of changes, the person(s) authorizing the change and any necessary actions arising from the review?'
              ]
            }
          ]
        },
        {
          clause: '8.6',
          title: 'Release of products and services',
          items: [
            'Does the organization implement planned arrangements, at appropriate stages, to verify that the product and service requirements have been met?',
            'Does the release of products and services to the customer not proceed until the planned arrangements have been satisfactorily completed, unless otherwise approved by a relevant authority and, as applicable, by the customer?',
            'Does the organization retain documented information on the release of products and services?',
            'Does this documented information include:',
            'a) Evidence of conformity with the acceptance criteria?',
            'b) Traceability to the person(s) authorizing the release?'
          ]
        },
        {
          clause: '8.7',
          title: 'Control of nonconforming process outputs, products and services',
          subsections: [
            {
              clause: '8.7.1',
              title: 'General Control',
              items: [
                'Does the organization ensure that outputs that do not conform to their requirements are identified and controlled to prevent their unintended use or delivery?',
                'Does the organization take appropriate corrective action based on the nature of the nonconformity and its effect on the conformity of products and services?',
                'Does this also apply to nonconforming products and services detected after delivery of the products, during or after the provision of services?',
                'Does the organization deal with nonconforming outputs in one or more of the following ways:',
                'a) Correction?',
                'b) Segregation, containment, return or suspension of provision of products and services?',
                'c) Informing the customer?',
                'd) Obtaining authorization for acceptance under concession?',
                'When nonconforming outputs are corrected, is conformity to the requirements verified?',
                'Does the organization retain documented information of actions taken on nonconforming process outputs, products and services, including on any concessions obtained and on the person or authority that made the decision regarding dealing with the nonconformity?'
              ]
            },
            {
              clause: '8.7.2',
              title: 'Documentation Requirements',
              items: [
                'Does the organization retain documented information that:',
                'a) Describes the nonconformity?',
                'b) Describes the action taken?',
                'c) Describes any concessions obtained?',
                'd) Identifies the authority deciding the action in respect of the nonconformity.'
              ]
            }
          ]
        }
      ]
    },
    {
      clause: '9',
      title: 'Performance evaluation',
      subsections: [
        {
          clause: '9.1',
          title: 'Monitoring, measurement, analysis and evaluation',
          subsections: [
            {
              clause: '9.1.1',
              title: 'General',
              items: [
                'Has the organization determined:',
                'a) What needs to be monitored and measured?',
                'b) The methods for monitoring, measurement, analysis and evaluation, as applicable, to ensure valid results?',
                'c) When the monitoring and measuring shall be performed?',
                'd) When the results from monitoring and measurement shall be analyzed and evaluated?',
                'Does the organization evaluate the performance and the effectiveness of the quality management system?',
                'Does the organization retain appropriate documented information as evidence of the results?'
              ]
            },
            {
              clause: '9.1.2',
              title: 'Customer satisfaction',
              items: [
                'Does the organization monitor customer perceptions of the degree to which their needs and expectations have been fulfilled?',
                'Has the organization determined the methods for obtaining, monitoring and reviewing this information?',
                'NOTE Examples of monitoring customer perceptions can include customer surveys, customer feedback on delivered products and services, meetings with customers, market-share analysis, compliments, warranty claims and dealer reports.'
              ]
            },
            {
              clause: '9.1.3',
              title: 'Analysis and evaluation',
              items: [
                'Does the organization analyse and evaluate appropriate data and information arising from monitoring, measurement?',
                'Are the results of analysis used to evaluate:',
                'a) Conformity of products and services?',
                'b) The degree of customer satisfaction?',
                'c) The performance and effectiveness of the quality management system?',
                'd) If planning has been implemented effectively?',
                'e) The effectiveness of actions taken to address risks and opportunities?',
                'f) The performance of external providers?',
                'g) The need for improvements within the quality management system?',
                'NOTE Methods to analyse data can include statistical techniques.'
              ]
            }
          ]
        },
        {
          clause: '9.2',
          title: 'Internal audit',
          subsections: [
            {
              clause: '9.2.1',
              title: 'General Requirements',
              items: [
                'Does the organization conduct internal audits at planned intervals to provide information on whether the quality management system:',
                'a) Conforms to:',
                '1) The organization\'s own requirements for its quality management system?',
                '2) The requirements of ISO 9001?',
                'b) Is effectively implemented and maintained?'
              ]
            },
            {
              clause: '9.2.2',
              title: 'Audit Programme',
              items: [
                'Does the organization:',
                'a) Plan, establish, implement and maintain an audit programme(s) including the frequency, methods, responsibilities, planning requirements and reporting, which take into consideration the importance of the processes concerned, customer feedback, changes affecting the organization, and the results of previous audits?',
                'b) Define the audit criteria and scope for each audit?',
                'c) Select auditors and conduct audits to ensure objectivity and the impartiality of the audit process?',
                'd) Ensure that the results of the audits are reported to relevant management?',
                'e) Take appropriate correction and corrective actions without undue delay?',
                'f) Retain documented information as evidence of the implementation of the audit programme and the audit results?',
                'NOTE See ISO 19011 for guidance.'
              ]
            }
          ]
        },
        {
          clause: '9.3',
          title: 'Management review',
          subsections: [
            {
              clause: '9.3.1',
              title: 'General',
              items: [
                'Does top management review the organization\'s quality management system, at planned intervals, to ensure its continuing suitability, adequacy, effectiveness and alignment with the strategic direction of the organization?'
              ]
            },
            {
              clause: '9.3.2',
              title: 'Management review inputs',
              items: [
                'Is the management review planned and carried out taking into consideration:',
                'a) The status of actions from previous management reviews?',
                'b) Changes in external and internal issues that are relevant to the quality management system?',
                'c) Information on the performance and effectiveness of the quality management system, including trends in:',
                '1) Customer satisfaction and feedback from relevant interested parties?',
                '2) The extent to which quality objectives have been met?',
                '3) Process performance and conformity of products and services?',
                '4) Nonconformities and corrective actions?',
                '5) Monitoring and measurement results?',
                '6) Audit results?',
                '7) The performance of external providers?',
                'd) The adequacy of resources?',
                'e) The effectiveness of actions taken to address risks and opportunities (6.1)?',
                'f) Opportunities for improvement?'
              ]
            },
            {
              clause: '9.3.3',
              title: 'Management review outputs',
              items: [
                'Do the outputs of the management review include decisions and actions related to:',
                'a) Opportunities for improvement?',
                'b) Any need for changes to the quality management system?',
                'c) Resource needs?',
                'Does the organization retain documented information as evidence of the results of management reviews?'
              ]
            }
          ]
        }
      ]
    },
    {
      clause: '10',
      title: 'Improvement',
      subsections: [
        {
          clause: '10.1',
          title: 'General',
          items: [
            'Does the organization determine and select opportunities for improvement and implement any necessary actions to meet customer requirements and enhance customer satisfaction?',
            'Does this include:',
            'a) Improving products and services to meet requirements as well as to address future needs and expectations?',
            'b) Correcting, preventing or reducing undesired effects?',
            'c) Improving the performance and effectiveness of the quality management system?',
            'NOTE Examples of improvement can include correction, corrective action, continual improvement, breakthrough change, innovation and re-organization.'
          ]
        },
        {
          clause: '10.2',
          title: 'Non-conformity and corrective action',
          subsections: [
            {
              clause: '10.2.1',
              title: 'General Process',
              items: [
                'When a nonconformity occurs, including those arising from complaints, does the organization:',
                'a) React to the nonconformity and, as applicable:',
                '1) Take action to control and correct it?',
                '2) Deal with the consequences?',
                'b) Evaluate the need for action to eliminate the cause(s) of the nonconformity, in order that it does not recur or occur elsewhere, by:',
                '1) Reviewing and analysing the nonconformity?',
                '2) Determining the causes of the nonconformity?',
                '3) Determining if similar nonconformities exist, or could potentially occur',
                'c) Implement any action needed?',
                'd) Review the effectiveness of any corrective action taken?',
                'e) Update risks and opportunities determined during planning, if necessary?',
                'f) Make changes to the quality management system, if necessary?',
                'Are the corrective actions appropriate to the effects of the nonconformities encountered?'
              ]
            },
            {
              clause: '10.2.2',
              title: 'Documentation Requirements',
              items: [
                'Does the organization retain documented information as evidence of:',
                'a) The nature of the nonconformities and any subsequent actions taken?',
                'b) The results of any corrective action?'
              ]
            }
          ]
        },
        {
          clause: '10.3',
          title: 'Continual improvement',
          items: [
            'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
            'Does the organization consider the results of analysis and evaluation, and the outputs from management review, to determine if there are needs or opportunities that shall be addressed as part of continual improvement?'
          ]
        }
      ]
    }
  ];

  const handleInputChange = (field: keyof AuditChecklistData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRadioChange = (itemKey: string, column: 'yes' | 'no' | 'na', value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemKey]: {
          ...prev.checklistItems[itemKey],
          yes: column === 'yes' ? value : '',
          no: column === 'no' ? value : '',
          na: column === 'na' ? value : '',
          comments: prev.checklistItems[itemKey]?.comments || ''
        }
      }
    }));
  };

  const handleCommentsChange = (itemKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemKey]: {
          ...prev.checklistItems[itemKey],
          comments: value
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

  const renderSubsection = (subsection: AuditSubsection, sectionIndex: number, subsectionIndex: string | number) => {
    if (subsection.items) {
      return (
        <Box key={subsectionIndex} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {subsection.clause} {subsection.title}
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '60%' }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>Yes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>N/A</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Comments/Evidence/Audit Trails</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subsection.items.map((item: string, itemIndex: number) => {
                  const itemKey = `${sectionIndex}-${subsectionIndex}-${itemIndex}`;
                  return (
                    <TableRow key={itemIndex}>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{item}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <FormControl>
                          <RadioGroup
                            value={formData.checklistItems[itemKey]?.yes || ''}
                            onChange={(e) => handleRadioChange(itemKey, 'yes', e.target.value)}
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
                            value={formData.checklistItems[itemKey]?.no || ''}
                            onChange={(e) => handleRadioChange(itemKey, 'no', e.target.value)}
                          >
                            <FormControlLabel
                              value="no"
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
                              value="na"
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
                          value={formData.checklistItems[itemKey]?.comments || ''}
                          onChange={(e: { target: { value: string; }; }) => handleCommentsChange(itemKey, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    }

    if (subsection.subsections) {
      return (
        <Box key={subsectionIndex} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            {subsection.clause} {subsection.title}
          </Typography>
          {subsection.subsections.map((subSubsection: AuditSubsection, subSubsectionIndex: number) =>
            renderSubsection(subSubsection, sectionIndex, `${subsectionIndex}-${subSubsectionIndex}`)
          )}
        </Box>
      );
    }

    return null;
  };

  return (
    <PageContainer title="Internal Audit Checklist (ISO)" description="Internal Audit Checklist for ISO 9001">
      <Breadcrumb title="Internal Audit Checklist (ISO)" items={BCrumb} />
      
      <ParentCard title="Internal Audit Checklist (ISO 9001)">
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
            <Card key={sectionIndex} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                  {section.clause}. {section.title}
                </Typography>
                
                {section.subsections ? (
                  section.subsections.map((subsection: AuditSubsection, subsectionIndex: number) =>
                    renderSubsection(subsection, sectionIndex, subsectionIndex)
                  )
                ) : section.items ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '60%' }}>Details</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>Yes</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>No</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>N/A</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Comments/Evidence/Audit Trails</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.items.map((item: string, itemIndex: number) => {
                          const itemKey = `${sectionIndex}-${itemIndex}`;
                          return (
                            <TableRow key={itemIndex}>
                              <TableCell sx={{ fontSize: '0.85rem' }}>{item}</TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                <FormControl>
                                  <RadioGroup
                                    value={formData.checklistItems[itemKey]?.yes || ''}
                                    onChange={(e) => handleRadioChange(itemKey, 'yes', e.target.value)}
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
                                    value={formData.checklistItems[itemKey]?.no || ''}
                                    onChange={(e) => handleRadioChange(itemKey, 'no', e.target.value)}
                                  >
                                    <FormControlLabel
                                      value="no"
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
                                      value="na"
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
                                  value={formData.checklistItems[itemKey]?.comments || ''}
                                  onChange={(e: { target: { value: string; }; }) => handleCommentsChange(itemKey, e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null}
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

export default InternalAuditChecklistISO;

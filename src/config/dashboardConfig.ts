// src/config/dashboardConfig.ts
import { DashboardConfig, DashboardModule } from '../types/dashboard.types';

export const dashboardModules: DashboardConfig = {
  documentationControl: {
    id: 'documentation-control',
    title: 'DOCUMENTATION CONTROL',
    icon: 'ArticleOutlinedIcon',
    path: '/documentation-forms',
    description: 'Manage documentation, SOPs, and document control forms',
    forms: [
      { title: 'SOP Template', path: '/documentation-control', description: 'Standard Operating Procedure Template' },
      { title: 'Distribution Form', path: '/documentation-control/distribution_form', description: 'Document Distribution Management' },
      { title: 'Change/Cancelation Form', path: '/documentation-control/CancellationForm', description: 'Document Change and Cancellation' },
      { title: 'Documentation Revision Checklist', path: '/documentation-control/Document_Revision_Checklist', description: 'Document Revision Process' },
      { title: 'Request for Extra Copy', path: '/documentation-control/extra_copy_request', description: 'Extra Document Copy Request' },
      { title: 'Master Document List', path: '/documentation-control/master_document_list', description: 'Master Document Registry' },
      { title: 'New Documentation Request Form', path: '/documentation-control/Request_Form', description: 'New Document Creation Request' },
      { title: 'Approved Signature List', path: '/documentation-control/signature_list', description: 'Authorized Signatures Registry' },
    ]
  },
  
  deviationCapa: {
    id: 'deviation-capa',
    title: 'DEVIATION, NON-CONFORMITY AND CAPA SYSTEM',
    icon: 'ErrorOutlineOutlinedIcon',
    path: '/deviation-capa-forms',
    description: 'Manage deviations, non-conformities, and corrective actions',
    forms: [
      { title: 'Non-Conformity Report', path: '/forms/ncr', description: 'Report and track non-conformities' },
      { title: 'Deviation Report', path: '/forms/deviation', description: 'Document process deviations' },
      { title: 'CAPA Report', path: '/forms/capa', description: 'Corrective and Preventive Actions' },
      { title: 'CAPA Effectiveness Check', path: '/forms/capa-effectiveness', description: 'Verify CAPA effectiveness' },
      { title: 'Root Cause Trend Analysis', path: '/forms/root-cause-analysis', description: 'Analyze trends and root causes' },
      { title: 'NCR Logbook', path: '/forms/ncr-logbook', description: 'Non-conformity registry' },
      { title: 'CAPA Logbook', path: '/forms/capa-logbook', description: 'CAPA tracking registry' },
    ]
  },

  riskAssessment: {
    id: 'risk-assessment',
    title: 'RISK ASSESSMENT MANAGEMENT',
    icon: 'AssessmentOutlinedIcon',
    path: '/risk-management',
    description: 'Comprehensive risk assessment and management tools',
    forms: [
      { title: 'Risk Assessment Form', path: '/forms/risk-assessment', description: 'Identify and assess risks' },
      { title: 'Risk Assessment FollowUp', path: '/forms/risk-assessment-follow-up', description: 'Risk Assessment FollowUp' },
      { title: 'Risk Notification form', path: '/forms/risk-notification', description: 'Risk Notification form' },
      { title: 'Risk Plan', path: '/forms/risk-plan', description: 'Plan' },
      { title: 'Risk Template', path: '/forms/risk-template', description: 'Risk Template' },
    ]
  },

  training: {
    id: 'training',
    title: 'TRAINING EMPLOYEES',
    icon: 'SchoolOutlinedIcon',
    path: '/training-forms',
    description: 'Employee training and competency management',
    forms: [
      { title: 'Training Matrix', path: '/forms/training-matrix', description: 'Skills and training matrix' },
      { title: 'Annual training plan', path: '/forms/annual-training-plan', description: 'Annual training planning' },
      { title: 'Training Needs Form', path: '/forms/training-needs-form', description: 'Training Needs Form' },
      { title: 'Training Attendance Sheet', path: '/forms/training-attendance-sheet', description: 'Track training attendance' },
      { title: 'Training Evaluation Form', path: '/forms/training-evaluation-form', description: 'Evaluate training effectiveness' },
    ]
  },

  validation: {
    id: 'validation',
    title: 'VALIDATION & QUALIFICATION',
    icon: 'VerifiedUserOutlinedIcon',
    path: '/validation',
    description: 'Equipment validation and qualification processes',
    forms: [
      { title: 'Validation Master Plan', path: '/forms/validation-master-plan', description: 'Overall validation strategy' },
      { title: 'IQ Protocol', path: '/forms/iq-protocol', description: 'Installation Qualification' },
      { title: 'OQ Protocol', path: '/forms/oq-protocol', description: 'Operational Qualification' },
      { title: 'PQ Protocol', path: '/forms/pq-protocol', description: 'Performance Qualification' },
      { title: 'Validation Report', path: '/forms/validation-report', description: 'Validation summary report' },
      { title: 'Equipment Qualification Log', path: '/forms/equipment-log', description: 'Equipment qualification registry' },
    ]
  },

  changeControl: {
    id: 'change-control',
    title: 'CHANGE CONTROL',
    icon: 'SystemUpdateAltOutlinedIcon',
    path: '/change-control-forms',
    description: 'Manage changes to processes and systems',
    forms: [
      { title: 'Change Control Request', path: '/forms/change-request', description: 'Request process changes' },
      { title: 'Change Control Logbook', path: '/forms/change-logbook', description: 'Change tracking registry' },

    ]
  },

 vendorManagement: {
    id: 'vendor-management',
    title: 'VENDOR / CUSTOMER MANAGEMENT',
    icon: 'BusinessOutlinedIcon',
    path: '/vendor-management-forms',
    description: 'Supplier and customer relationship management',
    layoutType: 'split', // إضافة نوع التخطيط
    forms: [], // الـ forms العادية فاضية لأننا هنستخدم sections
    sections: [
      {
        title: 'VENDOR MANAGEMENT',
        description: 'Manage suppliers, vendors and service providers',
        forms: [
          { title: 'Service Provider Questionnaire', path: '/forms/service-providers-questionnaire', description: 'Qualify new suppliers and service providers' },
          { title: 'Service Providers List', path: '/forms/service-providers-list', description: 'Approved service providers registry' },
        ]
      },
      {
        title: 'CUSTOMER MANAGEMENT', 
        description: 'Manage customer relationships and feedback',
        forms: [
          { title: 'customer survey form', path: '/forms/servy-form', description: 'customer survey form' },
          { title: 'Customer Complaint Form', path: '/forms/customer-complaint', description: 'Customer complaint handling and resolution' },
          { title: 'Contact list of suppliers QA head', path: '/forms/contact-list', description: 'Contact list of suppliers QA head' },
          { title: 'customer complaint trend analysis', path: '/forms/customer-complaint-trend-analysis', description: 'customer complaint trend analysis' },
          { title: 'Recall Notification Letter', path: '/forms/recall-notification-letter', description: 'Recall Notification Letter' },
          { title: 'Report Of Recall Request', path: '/forms/report-of-recall-request', description: 'Report Of Recall Request' },
          { title: 'Recall Checklist', path: '/forms/recall-checklist', description: 'Recall Checklist' }
        ]
      }
    ]
  },

  guidelines: {
    id: 'guidelines',
    title: "GUIDELINE'S LIBRARIES",
    icon: 'LibraryBooksOutlinedIcon',
    path: '/guidelines',
    description: 'Access regulatory guidelines and standards',
    forms: [
      { title: 'GDP Guidelines', path: '/guidelines/gdp', description: 'Good Distribution Practice' },
      { title: 'GMP Guidelines', path: '/guidelines/gmp', description: 'Good Manufacturing Practice' },
      { title: 'GVP Guidelines', path: '/guidelines/gvp', description: 'Good Pharmacovigilance Practice' },
      { title: 'ISO Standards', path: '/guidelines/iso', description: 'ISO Quality Standards' },
      { title: 'FDA Regulations', path: '/guidelines/fda', description: 'FDA Regulatory Guidelines' },
      { title: 'ICH Guidelines', path: '/guidelines/ich', description: 'International Conference on Harmonisation' },
    ]
  },

  auditing: {
    id: 'auditing',
    title: 'AUDITING INTERNAL/EXTERNAL',
    icon: 'FindInPageOutlinedIcon',
    path: '/auditing-forms',
    description: 'Internal and external audit management',
    forms: [
      { title: 'Internal Audit Checklist (GDP)', path: '/forms/audit-gdp', description: 'GDP compliance audit' },
      { title: 'Internal Audit Report', path: '/forms/audit-report', description: 'Audit findings report' },
      { title: 'Action Plan for CAPA', path: '/forms/audit-capa', description: 'Post-audit corrective actions' },
      { title: 'Audit Logbook', path: '/forms/audit-logbook', description: 'Audit tracking registry' },
      { title: 'Internal Audit Checklist (ISO)', path: '/forms/audit-iso', description: 'ISO compliance audit' },
      { title: 'Internal Audit Checklist (HSE)', path: '/forms/audit-hse', description: 'Health, Safety & Environment audit' },
      { title: 'Internal Audit Checklist (GVP)', path: '/forms/audit-gvp', description: 'Pharmacovigilance audit' },
    ]
  },

  aiSupport: {
    id: 'ai-support',
    title: 'AI SUPPORT',
    icon: 'SmartToyOutlinedIcon',
    path: 'https://chatgpt.com',
    description: 'AI-powered assistance for QMS processes',
    external: true,
    forms: []
  }
};

export const getModuleById = (id: string): DashboardModule | undefined => {
  return Object.values(dashboardModules).find(module => module.id === id);
};

export const getAllModules = (): DashboardModule[] => {
  return Object.values(dashboardModules);
};

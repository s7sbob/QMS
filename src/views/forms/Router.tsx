/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Dashboard from '../views/dashboard/Dashboard';
import TwoSteps from 'src/views/authentication/auth/TwoSteps';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* *** Guards (الحارس) *** */
import SOPFullDocument from 'src/views/sopPurpose&Definition/Pages/SOPFullDocument';
import AllNotifications from 'src/layouts/full/vertical/header/AllNotifications';
import NewDocumentRequestForm from 'src/views/documentation/pages/NewDocumentRequestForm';

/* ****Pages***** */
const Documentation_Control = Loadable(
  lazy(() => import('../views/documentation/DocumentationControl')),
);
const SOPDetail = Loadable(lazy(() => import('../views/documentation/SOPDetail')));
const New_Creation_SOP = Loadable(lazy(() => import('../views/documentation/pages/NewCreation')));
const Document_Revision_Checklist = Loadable(
  lazy(() => import('../views/documentation/pages/DocumentRevisionChecklist')),
);
const CancellationForm = Loadable(
  lazy(() => import('../views/documentation/pages/CancellationForm')),
);
const Distribution_form = Loadable(
  lazy(() => import('../views/documentation/pages/DistributionForm')),
);

const Users_Page = Loadable(lazy(() => import('../views/Users-Page/Users')));

/* **** ITManagementPage ***** */
const ITManagementPage = Loadable(lazy(() => import('../views/ITManagement/ITManagementPage')));

/* **** QMS Forms ***** */
const CustomerComplaintForm = Loadable(lazy(() => import('../views/forms/CustomerComplaintForm')));
const CustomerComplaintLogbook = Loadable(lazy(() => import('../views/forms/CustomerComplaintLogbook')));
const CustomerComplaintTrendAnalysis = Loadable(lazy(() => import('../views/forms/CustomerComplaintTrendAnalysis')));
const RiskAssessmentForm = Loadable(lazy(() => import('../views/forms/RiskAssessmentForm')));
const RiskAssessmentFollowUp = Loadable(lazy(() => import('../views/forms/RiskAssessmentFollowUp')));
const QRMMinutesOfMeeting = Loadable(lazy(() => import('../views/forms/QRMMinutesOfMeeting')));
const RiskNotificationForm = Loadable(lazy(() => import('../views/forms/RiskNotificationForm')));
const ServiceProvidersQuestionnaire = Loadable(lazy(() => import('../views/forms/ServiceProvidersQuestionnaire')));
const RecallLogbook = Loadable(lazy(() => import('../views/forms/RecallLogbook')));
const ContactList = Loadable(lazy(() => import('../views/forms/ContactList')));
const QRMTeamApprovalForm = Loadable(lazy(() => import('../views/forms/QRMTeamApprovalForm')));
const SimpleTestForm = Loadable(lazy(() => import('../views/forms/SimpleTestForm')));

// New forms
const ServiceProvidersList = Loadable(lazy(() => import('../views/forms/ServiceProvidersList')));
const RecallNotificationLetter = Loadable(lazy(() => import('../views/forms/RecallNotificationLetter')));
const ReportOfRecallRequest = Loadable(lazy(() => import('../views/forms/ReportOfRecallRequest')));
const RecallChecklist = Loadable(lazy(() => import('../views/forms/RecallChecklist')));
const RiskPlan = Loadable(lazy(() => import('../views/forms/RiskPlan')));
const RiskTemplate = Loadable(lazy(() => import('../views/forms/RiskTemplate')));

// **** New module pages ****
const DocumentationForms = Loadable(lazy(() => import('../views/formsCategories/DocumentationForms')));
const DeviationCAPAForms = Loadable(lazy(() => import('../views/formsCategories/DeviationCAPAForms')));
const ChangeControlForms = Loadable(lazy(() => import('../views/formsCategories/ChangeControlForms')));
// const TrainingForms = Loadable(lazy(() => import('../views/formsCategories/TrainingForms')));
const AuditingForms = Loadable(lazy(() => import('../views/formsCategories/AuditingForms')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth/Login')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth/ForgotPassword')));
const ForgotPassword2 = Loadable(lazy(() => import('../views/authentication/auth/ForgotPassword')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

// front end pages
const Homepage = Loadable(lazy(() => import('../views/pages/frontend-pages/Homepage')));
const About = Loadable(lazy(() => import('../views/pages/frontend-pages/About')));
const Contact = Loadable(lazy(() => import('../views/pages/frontend-pages/Contact')));
const Portfolio = Loadable(lazy(() => import('../views/pages/frontend-pages/Portfolio')));
const PagePricing = Loadable(lazy(() => import('../views/pages/frontend-pages/Pricing')));
const BlogPage = Loadable(lazy(() => import('../views/pages/frontend-pages/Blog')));
const BlogPost = Loadable(lazy(() => import('../views/pages/frontend-pages/BlogPost')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/Users-Page', element: <Users_Page /> },
      { path: '/documentation-control', element: <Documentation_Control /> },

      { path: '/documentation-control/:id', element: <SOPDetail /> },
      { path: '/documentation-control/New_Creation_SOP', element: <New_Creation_SOP /> },
      {
        path: '/documentation-control/Document_Revision_Checklist',
        element: <Document_Revision_Checklist />,
      },
      { path: '/documentation-control/CancellationForm', element: <CancellationForm /> },
      { path: '/documentation-control/distribution_form', element: <Distribution_form /> },
      { path: '/ITManagementPage', element: <ITManagementPage /> },
      { path: '/SOPFullDocument', element: <SOPFullDocument /> },
      { path: '/documentation-control/Request_Form', element: <NewDocumentRequestForm /> },

      // مسارات الصفحات الجديدة لكل قسم
      { path: '/documentation-forms', element: <DocumentationForms /> },
      { path: '/deviation-capa-forms', element: <DeviationCAPAForms /> },
      { path: '/change-control-forms', element: <ChangeControlForms /> },
      // { path: '/training-forms', element: <TrainingForms /> },
      { path: '/auditing-forms', element: <AuditingForms /> },

      {
        path: '/all-notifications',
        element: <AllNotifications />,
      },

      // QMS Forms Routes
      { path: '/forms/simple-test', element: <SimpleTestForm /> },
      { path: '/forms/customer-complaint', element: <CustomerComplaintForm /> },
      { path: '/forms/customer-complaint-logbook', element: <CustomerComplaintLogbook /> },
      { path: '/forms/customer-complaint-trend-analysis', element: <CustomerComplaintTrendAnalysis /> },
      { path: '/forms/risk-assessment', element: <RiskAssessmentForm /> },
      { path: '/forms/risk-assessment-follow-up', element: <RiskAssessmentFollowUp /> },
      { path: '/forms/qrm-minutes-of-meeting', element: <QRMMinutesOfMeeting /> },
      { path: '/forms/risk-notification', element: <RiskNotificationForm /> },
      { path: '/forms/service-providers-questionnaire', element: <ServiceProvidersQuestionnaire /> },
      { path: '/forms/recall-logbook', element: <RecallLogbook /> },
      { path: '/forms/contact-list', element: <ContactList /> },
      { path: '/forms/qrm-team-approval', element: <QRMTeamApprovalForm /> },

      // New forms routes
      { path: '/forms/service-providers-list', element: <ServiceProvidersList /> },
      { path: '/forms/recall-notification-letter', element: <RecallNotificationLetter /> },
      { path: '/forms/report-of-recall-request', element: <ReportOfRecallRequest /> },
      { path: '/forms/recall-checklist', element: <RecallChecklist /> },
      { path: '/forms/risk-plan', element: <RiskPlan /> },
      { path: '/forms/risk-template', element: <RiskTemplate /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/register', element: <Register2 /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword /> },
      { path: '/auth/forgot-password', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '/frontend-pages/homepage', element: <Homepage /> },
      { path: '/frontend-pages/about', element: <About /> },
      { path: '/frontend-pages/contact', element: <Contact /> },
      { path: '/frontend-pages/portfolio', element: <Portfolio /> },
      { path: '/frontend-pages/pricing', element: <PagePricing /> },
      { path: '/frontend-pages/blog', element: <BlogPage /> },
      { path: '/frontend-pages/blog/detail/:id', element: <BlogPost /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;

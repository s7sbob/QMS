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
import AuthGuard from 'src/guards/AuthGuard'; // <--  تأكد من المسار الصحيح
import SOPFullDocument from 'src/views/sopPurpose&Definition/Pages/SOPFullDocument';

/* ****Pages***** */
const Documentation_Control = Loadable(lazy(() => import('../views/documentation/DocumentationControl')));
const SOPDetail = Loadable(lazy(() => import('../views/documentation/SOPDetail')));
const New_Creation_SOP = Loadable(lazy(() => import('../views/documentation/pages/NewCreation')));
const Document_Revision_Checklist = Loadable(
  lazy(() => import('../views/documentation/pages/DocumentRevisionChecklist')),
);
const CancellationForm = Loadable(lazy(() => import('../views/documentation/pages/CancellationForm')));
const Distribution_form = Loadable(lazy(() => import('../views/documentation/pages/DistributionForm')));

const Users_Page = Loadable(lazy(() => import('../views/Users-Page/Users')));



/* **** ITManagementPage ***** */

const ITManagementPage = Loadable(lazy(() => import('../views/ITManagement/ITManagementPage')));

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
    // جميع هذه المسارات نريد حمايتها بالتوكن
    path: '/',
    // نغلف الـ FullLayout بـ AuthGuard
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/Users-Page', element: <Users_Page /> },
      { path: '/documentation-control', element: < Documentation_Control/> },

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

      
      // لو كتب أي شيء مش معروف نوجهه لصفحة 404
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    // هذه المسارات لا نريد حمايتها (صفحات لوجن و ريجستر وغيرها)
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

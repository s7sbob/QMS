# QMS Frontend

<p align="center">
  <img src="./public/logo.png" alt="QMS Logo" width="200"/>
</p>

<h3 align="center">Quality Management System - Frontend Application</h3>

<p align="center">
  A comprehensive React-based web application for managing Quality Management processes in pharmaceutical and healthcare industries with bilingual support (English/Arabic) and real-time document collaboration.
</p>

---

## About the Project

**QMS (Quality Management System)** is an enterprise-grade application designed for pharmaceutical, healthcare, and manufacturing organizations to manage their quality control processes. The system provides end-to-end management of Standard Operating Procedures (SOPs), training, auditing, risk assessment, and compliance documentation.

### Key Highlights

- **Bilingual Support**: Full English and Arabic language support with RTL layout
- **Real-time Document Editing**: Integrated OnlyOffice for collaborative document editing
- **Multi-level Approval Workflow**: Role-based approval process (QA Associate → Supervisor → Manager)
- **Comprehensive QMS Modules**: 20+ quality management modules
- **Regulatory Compliance**: Designed for GDP, GMP, GVP, ISO, and FDA compliance

---

## Screenshots

> **Note**: Add your application screenshots to the `./screenshots/` folder

| Dashboard | SOP Editor |
|-----------|------------|
| ![Dashboard](./screenshots/dashboard.png) | ![SOP Editor](./screenshots/sop-editor.png) |

| Document Distribution | Approval Workflow |
|----------------------|-------------------|
| ![Distribution](./screenshots/distribution.png) | ![Approval Workflow](./screenshots/approval-workflow.png) |

| Training Management | Audit Checklist |
|--------------------|-----------------|
| ![Training](./screenshots/training.png) | ![Audit](./screenshots/audit.png) |

---

## System Features

### 1. Documentation Control

| Feature | Description |
|---------|-------------|
| **SOP Templates & Management** | Create, edit, and manage Standard Operating Procedures with version control |
| **Document Distribution** | Track and manage document distribution across departments |
| **Document Revision Checklists** | Systematic revision tracking with approval workflows |
| **Document Cancellation Forms** | Formal document cancellation with justification tracking |
| **Master Document List** | Centralized registry of all controlled documents |
| **Document Request Forms** | Request new documents or document modifications |
| **Approved Signature List** | Manage authorized signatories for document approval |

### 2. Deviation, Non-Conformity & CAPA System

| Feature | Description |
|---------|-------------|
| **Non-Conformity Report (NCR)** | Document and track non-conformance events |
| **Deviation Reports** | Record and manage process deviations |
| **CAPA Reports** | Corrective and Preventive Action management |
| **CAPA Effectiveness Checks** | Verify the effectiveness of implemented CAPAs |
| **Root Cause Trend Analysis** | Analyze patterns and trends in quality issues |
| **NCR & CAPA Logbooks** | Historical records of all NCRs and CAPAs |

### 3. Risk Assessment Management

| Feature | Description |
|---------|-------------|
| **Risk Assessment Forms** | Identify and evaluate potential risks |
| **Risk Follow-up Tracking** | Monitor risk mitigation progress |
| **Risk Notification Forms** | Alert stakeholders of identified risks |
| **Risk Planning Documents** | Strategic risk mitigation planning |

### 4. Change Control Management

| Feature | Description |
|---------|-------------|
| **Change Control Request Forms** | Formal change request submission and tracking |
| **Change Control Logbooks** | Complete change history documentation |
| **Department Agreement Tracking** | Multi-department approval for changes |

### 5. Training Management

| Feature | Description |
|---------|-------------|
| **Training Matrix** | Skills and training requirements mapping |
| **Annual Training Plans** | Yearly training schedule management |
| **Training Needs Assessment** | Identify training gaps and requirements |
| **Training Attendance Sheets** | Record training participation |
| **Training Evaluation Forms** | Assess training effectiveness |

### 6. Auditing Management

| Feature | Description |
|---------|-------------|
| **Internal Audit Checklists** | GDP, ISO, HSE, GVP audit checklists |
| **Internal Audit Reports** | Comprehensive audit findings documentation |
| **Audit Action Plans** | CAPA tracking from audit findings |
| **Audit Logbooks** | Historical audit records |

### 7. Vendor/Customer Management

| Feature | Description |
|---------|-------------|
| **Service Provider Questionnaires** | Vendor qualification assessments |
| **Service Providers List** | Approved vendor registry |
| **Customer Complaint Forms** | Log and track customer complaints |
| **Customer Complaint Logbooks** | Historical complaint records |
| **Complaint Trend Analysis** | Pattern analysis in customer feedback |
| **Recall Management** | Product recall notifications and tracking |

### 8. Validation & Qualification

| Feature | Description |
|---------|-------------|
| **Validation Master Plans** | Overall validation strategy documents |
| **IQ Protocols** | Installation Qualification documentation |
| **OQ Protocols** | Operational Qualification documentation |
| **PQ Protocols** | Performance Qualification documentation |
| **Validation Reports** | Comprehensive validation summaries |
| **Equipment Qualification Logs** | Equipment qualification tracking |

### 9. Guidelines & Reference Libraries

| Feature | Description |
|---------|-------------|
| **GDP Guidelines** | Good Distribution Practice references |
| **GMP Guidelines** | Good Manufacturing Practice references |
| **GVP Guidelines** | Good Pharmacovigilance Practice references |
| **ISO Standards** | International Organization for Standardization references |
| **FDA Regulations** | U.S. Food and Drug Administration guidelines |
| **ICH Guidelines** | International Council for Harmonisation references |

---

## User Workflow

### SOP Creation & Approval Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SOP LIFECYCLE WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│   │  CREATE  │───>│  REVIEW  │───>│ APPROVE  │───>│  ACTIVE  │             │
│   │  (Draft) │    │(Reviewer)│    │(Manager) │    │(Published)│             │
│   └──────────┘    └────┬─────┘    └────┬─────┘    └──────────┘             │
│                        │               │                                     │
│                        v               v                                     │
│                   ┌─────────┐    ┌─────────┐                                │
│                   │ REJECTED│    │ REJECTED│                                │
│                   │(Revise) │    │(Revise) │                                │
│                   └─────────┘    └─────────┘                                │
│                                                                              │
│   After 2 Years:  ┌──────────┐                                              │
│                   │ ARCHIVED │  (Automatic status update)                   │
│                   └──────────┘                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Role-Based Access

| Role | Permissions |
|------|-------------|
| **QA Associate** | Create drafts, submit for review, view documents |
| **QA Supervisor** | Review documents, approve/reject, add comments |
| **QA Manager** | Final approval, archive, manage all documents |
| **Department User** | View distributed documents, acknowledge receipt |

### Document Distribution Flow

```
Document Approved ──> Generate Distribution List ──> Notify Departments
                                                            │
                                                            v
                              Track Acknowledgments <── Department Review
```

---

## Technical Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│   │   Views     │    │ Components  │    │   Layouts   │                    │
│   │  (Pages)    │<──>│ (Reusable)  │<──>│  (Wrappers) │                    │
│   └──────┬──────┘    └──────┬──────┘    └─────────────┘                    │
│          │                  │                                               │
│          v                  v                                               │
│   ┌─────────────────────────────────────┐                                  │
│   │           Redux Store               │                                  │
│   │  (Global State Management)          │                                  │
│   └──────────────────┬──────────────────┘                                  │
│                      │                                                      │
│                      v                                                      │
│   ┌─────────────────────────────────────┐                                  │
│   │         API Services (Axios)        │                                  │
│   └──────────────────┬──────────────────┘                                  │
│                      │                                                      │
│                      v                                                      │
│   ┌─────────────────────────────────────┐                                  │
│   │     Backend API (Express.js)        │                                  │
│   └─────────────────────────────────────┘                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── OnlyOffice/       # Document editor integration
│   ├── apps/             # Feature-specific components
│   └── material-ui/      # MUI component wrappers
├── views/                # Page-level components
│   ├── authentication/   # Login, Register, Forgot Password
│   ├── sopHeader/        # SOP management views
│   ├── dashboard/        # Dashboard components
│   └── qms-modules/      # QMS feature modules
├── store/                # Redux state management
│   └── slices/           # Feature-specific state slices
├── services/             # API communication layer
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── routes/               # Application routing
├── utils/                # Utility functions
└── assets/               # Images, CSS, static files
```

### Key Integrations

| Integration | Purpose |
|-------------|---------|
| **OnlyOffice** | Real-time collaborative document editing |
| **Socket.io** | Real-time notifications and updates |
| **i18next** | Internationalization (English/Arabic) |
| **React-PDF** | PDF generation and viewing |
| **CASL** | Role-based access control |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **UI Library** | Material-UI (MUI) v5 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Document Editor** | OnlyOffice Document Server |
| **Rich Text Editors** | CKEditor, Jodit, TipTap |
| **PDF Generation** | React-PDF |
| **Real-time** | Socket.io Client |
| **Internationalization** | i18next |
| **Forms** | Formik + Yup |
| **Charts** | ApexCharts |
| **Data Grid** | MUI X Data Grid |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- OnlyOffice Document Server (hosted on VPS)

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd QMS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables (see below)

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=https://localhost:3000

# OnlyOffice Document Server URL
VITE_ONLYOFFICE_SERVER_URL=https://your-domain.com/onlyoffice/
```

### Environment Variables Description

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://localhost:3000` |
| `VITE_ONLYOFFICE_SERVER_URL` | OnlyOffice Document Server URL | `https://qualitylead-qms.duckdns.org/onlyoffice/` |

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## OnlyOffice Integration

The application integrates with OnlyOffice Document Server for real-time document editing:

1. **OnlyOffice API Script:** Loaded in `index.html`:
   ```html
   <script src="https://your-domain.com/onlyoffice/web-apps/apps/api/documents/api.js"></script>
   ```

2. **Editor Component:** Located at `src/components/OnlyOffice/OnlyOfficeEditor.tsx`

3. **Configuration:** The editor receives configuration from the backend including:
   - Document URL
   - Document key
   - JWT token for authentication
   - User permissions

### Troubleshooting OnlyOffice

- **JWT Token Error (-20):** Ensure the JWT secret matches between backend and OnlyOffice server
- **Document not loading:** Verify the document URL is accessible from OnlyOffice server
- **CORS errors:** Configure OnlyOffice server to allow your frontend domain

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

---

## Adding Screenshots

To add screenshots to this README:

1. Create a `screenshots` folder in the project root:
   ```bash
   mkdir screenshots
   ```

2. Add the following screenshots:
   - `dashboard.png` - Main dashboard view
   - `sop-editor.png` - SOP editing interface
   - `distribution.png` - Document distribution screen
   - `approval-workflow.png` - Approval process view
   - `training.png` - Training management module
   - `audit.png` - Audit checklist interface

---

## License

Proprietary - All rights reserved

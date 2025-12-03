# 🏭 QMS Frontend

> **Enterprise-grade Quality Management System - Web Application** ✨

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

## 📋 Overview

**QMS (Quality Management System)** is a comprehensive web application designed for organizations seeking ISO 9001 compliance and operational excellence. This frontend application provides a rich, intuitive interface for managing Standard Operating Procedures (SOPs), document control, quality forms, audits, and organizational workflows.

🌍 The system supports bilingual operations (English/Arabic with RTL layout) and features real-time notifications, role-based access control, and comprehensive audit trails.

![Dashboard Preview](https://via.placeholder.com/800x400?text=QMS+Dashboard+Preview)

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 📝 **SOP Management** | Create, edit, version, and manage Standard Operating Procedures with multi-section support (Definition, Purpose, Scope, Procedures, Results, References, Safety Concerns, Critical Control Points) |
| 📁 **Document Control** | Secure document uploads, distribution tracking, and file request workflows with AWS S3 integration |
| 📋 **Quality Forms** | CAPA (Corrective & Preventive Actions), Change Control, Customer Complaints, Deviation Reports, Audit Logbooks |
| 📊 **Dashboard & Analytics** | Visual dashboards with charts and metrics for quality performance tracking |
| 👥 **User Management** | Role-based access control with Admin, QA, and Auditor roles |
| 🔄 **Revision Workflows** | Document revision requests with multi-level approval processes |
| 🔔 **Real-time Notifications** | Live updates via WebSocket integration |
| 🌐 **Multilingual Support** | Full English/Arabic interface with RTL layout support |
| 📄 **PDF Generation** | Generate and view PDF documents directly in the application |
| 💻 **IT Management** | IT infrastructure, asset tracking, and organizational hierarchy management |
| ✅ **Validation & Qualification** | IQ/OQ/PQ protocols, validation master plans, equipment qualification logging |
| 📖 **Guidelines Library** | Reference library for GDP, GMP, GVP, ISO, FDA, ICH regulatory guidelines |
| 🔍 **Advanced Audit Management** | Multiple audit types (GDP, ISO, HSE, GVP) with specialized compliance checklists |
| ⚠️ **Quality Risk Management** | QRM team approval workflows, risk assessment forms, risk notification, meeting minutes |
| 🏭 **Vendor/Supplier Management** | Service provider questionnaires, approved vendor registry, recall management workflows |
| 📋 **NCR & Deviation Management** | Non-conformity reports, deviation tracking, NCR logbook with trend analysis |
| 🔎 **Root Cause Analysis** | Root causes trend analysis tools for quality improvement |
| 📑 **Master Document List** | Centralized document registry management |
| ✍️ **Approved Signatures** | Digital signature list management for document approvals |
| 📞 **Contact Management** | Contact list management for vendors, suppliers, and customers |
| 🔄 **Recall Management** | Recall checklists, notification letters, recall logbook, and request reports |

![Features Overview](https://via.placeholder.com/800x300?text=QMS+Features+Overview)

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| ⚛️ **Framework** | React 18.3.1 |
| 📘 **Language** | TypeScript 5.0 |
| ⚡ **Build Tool** | Vite 4.4.5 |
| 🗃️ **State Management** | Redux Toolkit, React Redux |
| 🎨 **UI Library** | Material-UI (MUI) 5.16.6, MUI X DataGrid Premium |
| ✏️ **Rich Text Editors** | CKEditor 5, TipTap, Jodit React, React Quill |
| 📝 **Forms & Validation** | Formik, Yup |
| 🌍 **Internationalization** | i18next, react-i18next |
| 🔌 **Real-time** | Socket.IO Client |
| 📈 **Charts** | ApexCharts |
| 📄 **PDF** | React-PDF, @react-pdf/renderer |
| 🖱️ **Drag & Drop** | React Beautiful DnD, React Dropzone |
| 📅 **Date Handling** | MUI X Date Pickers, date-fns |
| 🎯 **Icons** | Tabler Icons, MUI Icons |
| 🎬 **Animations** | Framer Motion, React Spring |
| 🔐 **Authorization** | CASL (role-based permissions) |

---

## 🏗️ Architecture

```
src/
├── 🧩 components/        # Reusable UI components
├── 📱 views/             # Page components
│   ├── 📊 Dashboard/     # Main dashboard
│   ├── 📋 forms/         # Quality forms (CAPA, Change Control, etc.)
│   ├── 📝 documentation/ # SOP and document management
│   ├── 💻 ITManagement/  # IT infrastructure module
│   └── 👥 Users/         # User management
├── 🛤️ routes/            # React Router configuration
├── 🗃️ store/             # Redux store and slices
├── 🔌 services/          # API service layer
├── 🎭 context/           # React Context providers
├── 🎨 theme/             # Material-UI theme customization
├── 📐 layouts/           # Page layout templates
├── 🛡️ guards/            # Route protection/authorization
├── 🪝 hooks/             # Custom React hooks
├── 🔧 utils/             # Utility functions
└── 🌐 locales/           # i18n translation files
```

---

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js 18.x or higher
- 📥 npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository 🚚
git clone https://github.com/your-org/QMS.git && cd QMS

# 2. Install dependencies 📦
npm install   # or yarn / pnpm install

# 3. Environment setup 🔑
cp .env.example .env
# Update API endpoint and other configuration

# 4. Start development server 🔥
npm run dev   # or yarn dev / pnpm dev

# 🌐 Application runs on http://localhost:5173
```

### 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | 🔗 Backend API base URL |
| `VITE_SOCKET_URL` | 🔌 WebSocket server URL |
| `VITE_APP_TITLE` | 📛 Application title |

---

## 🔍 Features Deep Dive

### 📝 SOP Management
![SOP Management](https://via.placeholder.com/600x200?text=SOP+Management+Module)

- 📑 **Multi-section documents**: Definition, Purpose, Scope, Procedures, Results, References, Safety Concerns, Critical Control Points
- 🌍 **Bilingual content**: English and Arabic content with automatic RTL switching
- 📚 **Version control**: Full version history with audit trails
- ✏️ **Rich text editing**: Multiple editor options for content creation
- 🔄 **Status workflow**: Draft → Review → Approved → Archived

### 📋 Quality Forms
![Quality Forms](https://via.placeholder.com/600x200?text=Quality+Forms+Module)

**CAPA & Deviation:**
- ✅ **CAPA Forms**: Report, Logbook, Effectiveness Check, Action Plan
- ⚠️ **Deviation Reports**: Non-conformance documentation with NCR logbook
- 🔎 **Root Cause Analysis**: Trend analysis tools

**Change Control:**
- 🔄 **Change Control**: Request forms and logbooks with multi-level approval

**Auditing:**
- 📊 **Audit Management**: Internal Audit Reports, Audit Logbook
- 📝 **Audit Checklists**: GDP, ISO, HSE, GVP compliance checklists

**Training:**
- 📅 **Training Management**: Matrix, Annual Plan, Needs Form, Attendance Sheet, Evaluation Form

**Customer & Vendor:**
- 📢 **Customer Complaints**: Complaint form, logbook, and trend analysis
- 🏭 **Vendor Management**: Service Provider Questionnaire, Provider List, Contact List

**Risk Management:**
- ⚠️ **QRM Forms**: Risk Assessment, Follow-up, Notification, Risk Plan
- 📝 **QRM Meetings**: Meeting Minutes, Team Approval Forms

**Recall Management:**
- 🔄 **Recall Workflow**: Checklist, Notification Letter, Logbook, Request Report

### 📁 Document Control
![Document Control](https://via.placeholder.com/600x200?text=Document+Control+Module)

- ☁️ **Secure uploads**: Integration with AWS S3 storage
- 📤 **Distribution tracking**: Track document distribution to departments
- 📨 **File requests**: Formal request and approval workflow
- ❌ **Cancel forms**: Document cancellation tracking

### 👥 User & Role Management
![User Management](https://via.placeholder.com/600x200?text=User+Management+Module)

- 🔐 **RBAC**: Admin, QA Associate, QA Document Officer, QA Manager, QA Supervisor roles
- 🏢 **Department assignment**: Users can belong to multiple departments
- 📜 **Activity tracking**: Complete user action history
- 🛡️ **Permission guards**: Route-level access control with CASL

### 🧭 Module Hubs

The application organizes forms into dedicated module hubs for easy navigation:

| Module Hub | Description |
|------------|-------------|
| 📁 **Documentation Forms** | SOP creation, revision, distribution, and document requests |
| ⚠️ **Deviation & CAPA** | Non-conformity reports, deviation tracking, CAPA workflows |
| 🔄 **Change Control** | Change requests, approvals, and change logbooks |
| 📚 **Training** | Training matrix, plans, attendance, and evaluations |
| 🔍 **Auditing** | Audit checklists (GDP, ISO, HSE, GVP), reports, and logbooks |
| 🏭 **Vendor Management** | Supplier questionnaires, vendor registry, recalls |
| ⚠️ **Risk Management** | Risk assessments, QRM workflows, meeting documentation |
| ✅ **Validation** | IQ/OQ/PQ protocols and validation master plans |
| 📖 **Guidelines** | Regulatory guidelines reference library |

---

## 📜 Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | 🔥 Start development server with HMR |
| `npm run build` | 🏗️ Build for production |
| `npm run preview` | 👁️ Preview production build |
| `npm run lint` | 🔍 Run ESLint |

---

## 🌐 Browser Support

- 🌐 Chrome (latest)
- 🦊 Firefox (latest)
- 🧭 Safari (latest)
- 📐 Edge (latest)

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feat/new-feature`)
3. 💾 Commit your changes (`git commit -m 'Add new feature'`)
4. 📤 Push to the branch (`git push origin feat/new-feature`)
5. 🔃 Open a Pull Request

---

## 🔗 Related Projects

- 🔙 [Qms-BackEnd](../Qms-BackEnd) - Backend API for QMS

---

## 📄 License

Distributed under the **MIT License** — see `LICENSE` for details.

---

## 💬 Feedback & Support

Have questions or suggestions? Open an issue or reach out! 🚀

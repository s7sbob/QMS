# QMS Frontend

Quality Management System (QMS) - Frontend Application

A React-based web application for managing Standard Operating Procedures (SOPs) with bilingual support (English/Arabic) and OnlyOffice document integration.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) v5
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Document Editor:** OnlyOffice Document Server
- **Rich Text Editors:** CKEditor, Jodit, TipTap
- **PDF Generation:** React-PDF
- **Real-time:** Socket.io Client

## Prerequisites

- Node.js 18+
- npm or yarn
- OnlyOffice Document Server (hosted on VPS)

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

## Project Structure

```
QMS/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── OnlyOffice/     # OnlyOffice editor integration
│   ├── views/              # Page components
│   │   └── sopPurpose&Definition/  # SOP section components
│   ├── context/            # React contexts
│   ├── redux/              # Redux store and slices
│   ├── utils/              # Utility functions
│   └── routes/             # Route definitions
├── public/                 # Static assets
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
└── package.json
```

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

## Features

- Bilingual SOP management (English/Arabic)
- Real-time document editing with OnlyOffice
- Role-based access control (QA Associate, QA Supervisor, QA Manager)
- Document version history
- Review and approval workflow
- Notifications system
- PDF export

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## License

Proprietary - All rights reserved

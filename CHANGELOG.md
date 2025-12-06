# Changelog

All notable changes to the QMS (Quality Management System) application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-12-06

### Added
- **SOP Workflow Stepper**: Added Colorlib-style stepper component to `SOPFullDocument.tsx`
  - Dynamic status progression display
  - Gradient styling (orange-red-purple)
  - Warning indicators for "Needs Fixes" and rejection statuses
  - Bilingual support (English/Arabic)
  - Configurable `allowedStatuses` prop for different workflows

- **Sop_Status CRUD API**: New backend API for managing SOP statuses
  - `GET /api/sopStatus/getAll` - Fetch all active statuses (all users)
  - `GET /api/sopStatus/get/:id` - Fetch single status (all users)
  - `POST /api/sopStatus/add` - Create status (Admin/SYS admin only)
  - `PATCH /api/sopStatus/update/:id` - Update status (Admin/SYS admin only)
  - `DELETE /api/sopStatus/delete/:id` - Soft delete status (Admin/SYS admin only)

- **Role-based Authorization**: Added permission checks for Sop_Status management
  - Only "SYS admin" and "Admin" roles can create, update, or delete statuses
  - All authenticated users can query statuses

- **Version Display**: Added application version footer
  - Version number displayed at bottom of application
  - CHANGELOG.md for tracking update history

### Files Created
- `Qms-BackEnd/src/repositories/sopRepositories/sopStatusRepository.ts`
- `Qms-BackEnd/src/services/sopServices/sopStatus.Service.ts`
- `Qms-BackEnd/src/controllers/sopControllers/sopStatus.Controller.ts`
- `Qms-BackEnd/src/routes/sopRoutes/sopStatus.Routes.ts`
- `QMS/src/views/sopPurpose&Definition/types/SopStatus.ts`
- `QMS/src/views/sopPurpose&Definition/components/SopWorkflowStepper.tsx`
- `QMS/src/config/version.ts`
- `QMS/src/layouts/full/shared/footer/AppFooter.tsx`
- `QMS/CHANGELOG.md`

### Files Modified
- `Qms-BackEnd/src/index.ts` - Added sopStatus routes
- `QMS/src/views/sopPurpose&Definition/Pages/SOPFullDocument.tsx` - Integrated stepper
- `QMS/src/layouts/full/FullLayout.tsx` - Added footer component

---

## How to Update Version

When making changes to the application:

1. Update the version in `src/config/version.ts`:
   - **Major**: Breaking changes or major new features
   - **Minor**: New features, backwards compatible
   - **Patch**: Bug fixes, small improvements
   - **Build**: Update the date (YYYY.MM.DD)

2. Add a new section to this CHANGELOG.md file with:
   - Version number and date
   - Categorized changes (Added, Changed, Fixed, Removed, etc.)
   - List of files created/modified

---

## Version History

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0.0   | 2025-12-06 | Initial versioning, SOP Workflow Stepper |

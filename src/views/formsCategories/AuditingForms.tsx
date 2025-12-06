// src/pages/AuditingForms.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const AuditingForms: React.FC = () => {
  const module = getModuleById('auditing');
  return <FormsList module={module} />;
};

export default AuditingForms;
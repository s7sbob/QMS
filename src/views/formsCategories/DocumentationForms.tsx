// src/pages/DocumentationForms.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const DocumentationForms: React.FC = () => {
  const module = getModuleById('documentation-control');
  return <FormsList module={module} />;
};

export default DocumentationForms;
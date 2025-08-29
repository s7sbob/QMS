// src/pages/ChangeControlForms.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const ChangeControlForms: React.FC = () => {
  const module = getModuleById('change-control');
  return <FormsList module={module} />;
};

export default ChangeControlForms;
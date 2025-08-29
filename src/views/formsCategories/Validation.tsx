// src/pages/Validation.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const Validation: React.FC = () => {
  const module = getModuleById('validation');
  return <FormsList module={module} />;
};

export default Validation;
// src/pages/Guidelines.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const Guidelines: React.FC = () => {
  const module = getModuleById('guidelines');
  return <FormsList module={module} />;
};

export default Guidelines;
// src/pages/DeviationCAPAForms.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const DeviationCAPAForms: React.FC = () => {
  const module = getModuleById('deviation-capa');
  return <FormsList module={module} />;
};

export default DeviationCAPAForms;
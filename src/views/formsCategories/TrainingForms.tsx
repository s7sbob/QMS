// src/pages/TrainingForms.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const TrainingForms: React.FC = () => {
  const module = getModuleById('training');
  return <FormsList module={module} />;
};

export default TrainingForms;
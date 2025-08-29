// src/pages/RiskManagement.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const RiskManagement: React.FC = () => {
  const module = getModuleById('risk-assessment');
  return <FormsList module={module} />;
};

export default RiskManagement;

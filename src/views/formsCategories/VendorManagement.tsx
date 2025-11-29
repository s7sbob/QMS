// src/pages/VendorManagement.tsx
import React from 'react';
import FormsList from 'src/components/FormsList';
import { getModuleById } from 'src/config/dashboardConfig';

const VendorManagement: React.FC = () => {
  const module = getModuleById('vendor-management');
  return <FormsList module={module} />;
};

export default VendorManagement;
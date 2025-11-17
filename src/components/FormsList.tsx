// src/components/FormsList.tsx
import React from 'react';
import { DashboardModule } from '../types/dashboard.types';
import SplitFormsList from './SplitFormsList';
import DefaultFormsList from './DefaultFormsList';

interface FormsListProps {
  module: DashboardModule | undefined;
}

const FormsList: React.FC<FormsListProps> = ({ module }) => {
  if (!module) {
    return <DefaultFormsList module={module} />;
  }

  // إذا كان النوع split، استخدم SplitFormsList
  if (module.layoutType === 'split') {
    return <SplitFormsList module={module} />;
  }

  // وإلا استخدم التخطيط العادي
  return <DefaultFormsList module={module} />;
};

export default FormsList;

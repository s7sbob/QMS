// src/components/SOPTemplate.tsx
import React, { ReactNode } from 'react';
import SOPPaginatedDocument from './SOPPaginatedDocument';
import { SopHeader } from '../types/SopHeader';
import './sopDocument.css';

interface SOPTemplateProps {
  children: ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  return (
    <SOPPaginatedDocument headerData={headerData}>
      {children}
    </SOPPaginatedDocument>
  );
};

export default SOPTemplate;

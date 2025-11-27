// src/components/SOPContentPageHeader.tsx
import React from 'react';
import { SopHeader } from '../types/SopHeader';

interface SOPContentPageHeaderProps {
  headerData: SopHeader | null;
  currentPage: number;
  totalPages: number;
}

const SOPContentPageHeader: React.FC<SOPContentPageHeaderProps> = ({
  headerData,
  currentPage,
  totalPages,
}) => {
  if (!headerData) return null;

  return (
    <div className="content-page-header">
      {/* Left - Logo */}
      <div className="content-header-logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Center - Document Title */}
      <div className="content-header-title">
        <div className="content-header-title-row">
          <span className="title-label-en">Document Title:</span>
          <span className="title-value-en">{headerData.Doc_Title_en || 'Documentation System'}</span>
        </div>
        <div className="content-header-title-row-ar">
          <span className="title-value-ar">{headerData.Doc_Title_ar || 'نظام التوثيق'}</span>
          <span className="title-label-ar">:عنوان الوثيقة</span>
        </div>
      </div>

      {/* Right - Code/Version/Page */}
      <div className="content-header-info">
        <table>
          <tbody>
            <tr>
              <td className="info-label">Code #</td>
              <td className="info-value">: {headerData.Doc_Code}</td>
            </tr>
            <tr>
              <td className="info-label">Version #</td>
              <td className="info-value">: {headerData.Version}</td>
            </tr>
            <tr>
              <td className="info-label">Page #</td>
              <td className="info-value">: {currentPage} of {totalPages}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SOPContentPageHeader;

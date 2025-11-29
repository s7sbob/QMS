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
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '15px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <tbody>
        <tr>
          {/* Left Column - Logo & Division */}
          <td
            style={{
              width: '25%',
              border: '2px solid #000',
              padding: '8px',
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ maxWidth: '170px', height: 'auto', marginBottom: '5px' }}
            />
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000000ff',
                marginTop: '5px',
              }}
            >
              Healthcare Division
            </div>
          </td>

          {/* Middle Column - Document Title */}
          <td
            style={{
              width: '50%',
              border: '2px solid #000',
              padding: '4px',
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '14px' }}>Document Title: </span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {headerData.Doc_Title_en || 'Documentation System'}
              </span>
            </div>
            <div style={{ direction: 'rtl' }}>
              <span style={{ fontSize: '14px' }}>عنوان الوثيقة: </span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {headerData.Doc_Title_ar || 'نظام التوثيق'}
              </span>
            </div>
          </td>

          {/* Right Column - Code/Version/Page */}
          <td
            style={{
              width: '25%',
              border: '2px solid #000',
              padding: '3px',
              verticalAlign: 'middle',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontSize: '14px', fontWeight: 'bold', padding: '1px 0' }}>
                    Code #
                  </td>
                  <td style={{ fontSize: '14px', padding: '1px 0' }}>
                    : {headerData.Doc_Code}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '14px', fontWeight: 'bold', padding: '1px 0' }}>
                    Version #:
                  </td>
                  <td style={{ fontSize: '14px', padding: '1px 0' }}>
                    {headerData.version ?? headerData.Version ?? 0}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '14px', fontWeight: 'bold', padding: '1px 0' }}>
                    Page #
                  </td>
                  <td style={{ fontSize: '14px', padding: '1px 0' }}>
                    : {currentPage} of {totalPages}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SOPContentPageHeader;

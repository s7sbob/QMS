// src/components/SOPCoverPage.tsx
import React from 'react';
import { SopHeader } from '../types/SopHeader';

interface SOPCoverPageProps {
  headerData: SopHeader | null;
  totalPages: number;
}

const formatDate = (iso: string | null | undefined) => (iso ? iso.split('T')[0] : '');

const SOPCoverPage: React.FC<SOPCoverPageProps> = ({ headerData, totalPages }) => {
  if (!headerData) return null;

  const preparedName = headerData?.User_Data_Sop_header_Prepared_ByToUser_Data
    ? `${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.FName} ${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.LName}`
    : '';
  const reviewedName = headerData?.User_Data_Sop_header_reviewed_byToUser_Data
    ? `${headerData.User_Data_Sop_header_reviewed_byToUser_Data.FName} ${headerData.User_Data_Sop_header_reviewed_byToUser_Data.LName}`
    : '';
  const approvedName = headerData?.User_Data_Sop_header_Approved_byToUser_Data
    ? `${headerData.User_Data_Sop_header_Approved_byToUser_Data.FName} ${headerData.User_Data_Sop_header_Approved_byToUser_Data.LName}`
    : '';

  return (
    <div className="sop-page sop-cover-page">
      {/* ===== HEADER SECTION ===== */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
        <tbody>
          <tr>
            {/* Left Column - Dates */}
            <td style={{ width: '35%', verticalAlign: 'top', borderRight: '1px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Issue Date:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>تاريخ الإصدار:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                      {formatDate(headerData.Issued_Date)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Effective Date:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>تاريخ الفاعلية:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px',fontWeight: 'bold', textAlign: 'center' }}>
                      {formatDate(headerData.Effective_Date)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Revision Date:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>تاريخ المراجعة:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px',fontWeight: 'bold', textAlign: 'center' }}>
                      {formatDate(headerData.Revision_Date)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Center Column - Logo */}
            <td style={{ width: '40%', textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #000', padding: '10px' }}>
              <img src="/logo.png" alt="Company Logo" style={{ maxWidth: '350px', height: 'auto' }} />
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#727c72c7', marginTop: '5px' }}>
                Healthcare Division
              </div>
            </td>

            {/* Right Column - Code/Version/Page */}
            <td style={{ width: '30%', verticalAlign: 'top' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Code #:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>كود الوثيقة:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                      {headerData.Doc_Code}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Version #:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>رقم الإصدار:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                      {headerData.version ?? headerData.Version ?? 0}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>Page #:</td>
                    <td style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>رقم الصفحة:</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                      1 of {totalPages}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== TITLE SECTION ===== */}
      <div style={{ marginTop: '30px', border: '1px solid #ffffffff' }}>
        {/* Row 1: Standard Operating Procedure - Light blue background */}
        <div style={{
          backgroundColor: 'rgba(197, 217, 241, 1)',
          padding: '12px 20px',
          textAlign: 'center',
          borderBottom: '4px solid #ffffffff'
        }}>
          <div style={{ fontSize: '25px', fontWeight: 'bold', color: '#000000' }}>
            Standard Operating Procedure
          </div>
        </div>
        {/* Row 2: Document Titles - Lighter blue background */}
        <div style={{
          backgroundColor: 'rgba(231, 238, 248, 1)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#000000' }}>
            {headerData.Doc_Title_en || 'Documentation Systems'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', direction: 'rtl', color: '#000000' }}>
            {headerData.Doc_Title_ar || 'نظام التوثيق'}
          </div>
        </div>
      </div>

      {/* ===== COMPANY LOGO SECTION ===== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0'
      }}>
        <img src="/logo.png" alt="Company Logo" style={{ width: '600px', height: 'auto', marginBottom: '50px' }} />
        <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#030303ff' }}>
          Healthcare Division
        </div>
      </div>

      {/* ===== PREPARED BY SECTION ===== */}
      <div style={{ marginTop: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
          <thead>
            <tr style={{ backgroundColor: '#d9e2f3' }}>
              <th style={{ border: '1px solid #000', padding: '8px', width: '12.5%' }}></th>
              <th style={{ border: '1px solid #000', padding: '8px', width: '12.5%' }}></th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>Prepared by</th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px', direction: 'rtl' }}>الإعداد</th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>Reviewed by</th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px', direction: 'rtl' }}>المراجعة</th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>Approved by</th>
              <th style={{ border: '1px solid #000', padding: '8px', fontSize: '12px', direction: 'rtl' }}>الاعتماد</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>Job title</td>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px', direction: 'rtl' }}>المسمى الوظيفي</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>QA Associate</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>QA Supervisor</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>QA Manager</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>Name</td>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px', direction: 'rtl' }}>الاسم</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{preparedName}</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{reviewedName}</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{approvedName}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>Signature</td>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px', direction: 'rtl' }}>التوقيع</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', height: '40px' }}>
                {headerData.prepared_by_sign && (
                  <img src={headerData.prepared_by_sign} alt="Signature" style={{ maxHeight: '35px' }} />
                )}
              </td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', height: '40px' }}>
                {headerData.reviewed_by_sign && (
                  <img src={headerData.reviewed_by_sign} alt="Signature" style={{ maxHeight: '35px' }} />
                )}
              </td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', height: '40px' }}>
                {headerData.approved_by_sign && (
                  <img src={headerData.approved_by_sign} alt="Signature" style={{ maxHeight: '35px' }} />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>Date</td>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold', fontSize: '12px', direction: 'rtl' }}>التاريخ</td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '11px' }}>
                {formatDate(headerData.prepared_date)}
              </td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '11px' }}>
                {formatDate(headerData.reviewed_date)}
              </td>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '11px' }}>
                {formatDate(headerData.approved_date)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '15px', color: '#c00000' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}>
            Unauthorized duplication is prohibited
          </div>
          <div style={{ fontSize: '12px', direction: 'rtl' }}>
            يمنع إعادة الطباعة لغير المختصين
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPCoverPage;

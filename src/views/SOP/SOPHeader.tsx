import React from 'react';

interface HeaderTableProps {
  issueDate?: string;
  effectiveDate?: string;
  revisionDate?: string;
  codeNumber?: string;
  versionNumber?: string;
  pageInfo?: string;
}

const HeaderTable: React.FC<HeaderTableProps> = ({
  issueDate = '',
  effectiveDate = '',
  revisionDate = '',
  codeNumber = 'GEN-SOP-001',
  versionNumber = '12',
  pageInfo = '1 of 42'
}) => {
  return (
    <div className="header-container" style={{ fontFamily: 'Arial, sans-serif', width: '100%' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        border: '1px solid black',
        tableLayout: 'fixed'
      }}>
        <tbody>
          {/* First Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', width: '15%' }}>Issue Date:</td>
            <td style={{ border: '1px solid black', padding: '8px', width: '15%', textAlign: 'right', direction: 'rtl' }}>تاريخ الإصدار:</td>
            <td rowSpan={3} style={{ 
              border: '1px solid black', 
              textAlign: 'center', 
              verticalAlign: 'middle',
              width: '40%'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ 
                  border: '2px solid #1a4b8c', 
                  borderRadius: '10px', 
                  width: '100px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    backgroundColor: '#8cc63f', 
                    width: '40px', 
                    height: '120px', 
                    transform: 'rotate(45deg)', 
                    left: '30px', 
                    top: '-20px'
                  }}></div>
                  <div style={{ 
                    backgroundColor: '#1a4b8c', 
                    position: 'absolute', 
                    width: '30px', 
                    height: '30px', 
                    bottom: '5px',
                    left: '5px'
                  }}></div>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  marginTop: '10px', 
                  color: '#1a4b8c',
                  direction: 'rtl',
                  textAlign: 'center'
                }}>
                  شركة سقالة الرعاية الصحية
                </div>
                <div style={{ fontSize: '12px', color: '#1a4b8c' }}>
                  Cigalah Healthcare Company
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginTop: '10px'
                }}>
                  Healthcare Division
                </div>
              </div>
            </td>
            <td style={{ border: '1px solid black', padding: '8px', width: '15%' }}>Code #:</td>
            <td style={{ border: '1px solid black', padding: '8px', width: '15%', textAlign: 'right', direction: 'rtl' }}>كود الوثيقة:</td>
          </tr>
          
          {/* Second Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{issueDate}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', textAlign: 'center' }} colSpan={2}>{codeNumber}</td>
          </tr>
          
          {/* Third Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>Effective Date:</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', direction: 'rtl' }}>تاريخ الفعالية:</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>Version #:</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', direction: 'rtl' }}>رقم الإصدار:</td>
          </tr>
          
          {/* Fourth Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{effectiveDate}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', textAlign: 'center' }} colSpan={2}>{versionNumber}</td>
          </tr>
          
          {/* Fifth Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>Revision Date:</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', direction: 'rtl' }}>تاريخ المراجعة:</td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px' }}>Page #:</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', direction: 'rtl' }}>رقم الصفحة:</td>
          </tr>
          
          {/* Sixth Row */}
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{revisionDate}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', textAlign: 'center' }} colSpan={2}>{pageInfo}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HeaderTable;

// Example usage:
// <HeaderTable 
//   issueDate="01/01/2025"
//   effectiveDate="01/15/2025"
//   revisionDate="02/01/2025"
//   codeNumber="GEN-SOP-001"
//   versionNumber="12"
//   pageInfo="1 of 42"
// />
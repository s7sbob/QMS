// src/views/documentation/components/DistributionFormApprovalSection.tsx
import React from 'react';

interface DistributionFormApprovalSectionProps {
  preparedJobTitle: string;
  reviewedJobTitle: string;
  approvedJobTitle: string;
  preparedName: string;
  reviewedName: string;
  approvedName: string;
  preparedSignatureUrl?: string;
  reviewedSignatureUrl?: string;
  approvedSignatureUrl?: string;
  prepared_date?: string;
  reviewed_date?: string;
  approved_date?: string;
}

const DistributionFormApprovalSection: React.FC<DistributionFormApprovalSectionProps> = ({
  preparedJobTitle,
  reviewedJobTitle,
  approvedJobTitle,
  preparedName,
  reviewedName,
  approvedName,
  preparedSignatureUrl,
  reviewedSignatureUrl,
  approvedSignatureUrl,
  prepared_date,
  reviewed_date,
  approved_date,
}) => {
  // Function to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <table
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          marginTop: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                width: '25%',
              }}
              colSpan={2}
            ></th>
            <th
              style={{
                border: '1px solid #000',
                padding: '4px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              Prepared by
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              الإعداد
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '2px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              Reviewed by
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              المراجعة
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '2px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              Approved by
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                width: '12.5%',
              }}
            >
              الاعتماد
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1: Job Title */}
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Job Title
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              المسمى الوظيفي
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {preparedJobTitle}
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {reviewedJobTitle}
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {approvedJobTitle}
            </td>
          </tr>
          {/* Row 2: Name */}
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Name
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              الاسم
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {preparedName}
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {reviewedName}
            </td>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {approvedName}
            </td>
          </tr>
          {/* Row 3: Signature */}
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Signature
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              التوقيع
            </td>
            {/* Prepared Signature Cell */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '1px' }}>
              {preparedSignatureUrl && (
                <img
                  src={preparedSignatureUrl}
                  alt="Prepared Signature"
                  style={{ width: '170px', height: '50px' }}
                />
              )}
            </td>
            {/* Reviewed Signature Cell */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '1px' }}>
              {reviewedSignatureUrl && (
                <img
                  src={reviewedSignatureUrl}
                  alt="Reviewed Signature"
                  style={{ width: '170px', height: '40px' }}
                />
              )}
            </td>
            {/* Approved Signature Cell */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '1px' }}>
              {approvedSignatureUrl && (
                <img
                  src={approvedSignatureUrl}
                  alt="Approved Signature"
                  style={{ width: '170px', height: '40px' }}
                />
              )}
            </td>
          </tr>
          {/* Row 4: Date */}
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Date
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              التاريخ
            </td>
            {/* Prepared Date */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '8px' }}>
              {formatDate(prepared_date)}
            </td>
            {/* Reviewed Date */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '8px' }}>
              {formatDate(reviewed_date)}
            </td>
            {/* Approved Date */}
            <td colSpan={2} style={{ border: '1px solid #000', padding: '8px' }}>
              {formatDate(approved_date)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DistributionFormApprovalSection;

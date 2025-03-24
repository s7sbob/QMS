// src/components/PreparedBySection.tsx
import React from 'react';

interface PreparedBySectionProps {
  preparedJobTitle: string;
  reviewedJobTitle: string;
  approvedJobTitle: string;
  preparedName: string;
  reviewedName: string;
  approvedName: string;
  stampImageUrl?: string; // URL or path to your "DRAFT COPY" stamp image
  preparedSignatureUrl?: string; // URL or path to the prepared signature image
  reviewedSignatureUrl?: string; // URL or path to the reviewed signature image
  approvedSignatureUrl?: string; // URL or path to the approved signature image
  // التواريخ التي نريد عرضها
  prepared_date?: string;
  reviewed_date?: string;
  approved_date?: string;
}

const PreparedBySection: React.FC<PreparedBySectionProps> = ({
  preparedJobTitle,
  reviewedJobTitle,
  approvedJobTitle,
  preparedName,
  reviewedName,
  approvedName,
  stampImageUrl,
  preparedSignatureUrl,
  reviewedSignatureUrl,
  approvedSignatureUrl,
  prepared_date,
  reviewed_date,
  approved_date,
}) => {
  // دالة لتنسيق التاريخ
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {stampImageUrl && (
        <img
          src={stampImageUrl}
          alt="Draft Stamp"
          style={{
            position: 'absolute',
            top: '10px',
            left: '1px',
            opacity: 0.4,
            width: '250px',
            height: '100px',
            zIndex: 2,
          }}
        />
      )}

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
          {/* الصف الأول: عرض المسمى الوظيفي */}
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
          {/* الصف الثاني: عرض الأسماء */}
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
          {/* الصف الثالث: عرض التواقيع */}
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
          {/* الصف الرابع: عرض التواريخ */}
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

export default PreparedBySection;

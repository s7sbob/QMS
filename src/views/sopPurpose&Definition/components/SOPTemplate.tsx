// src/components/SOPTemplate.tsx
import React, { ReactNode, useMemo } from 'react';
import Header from './Header';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import { SopHeader } from '../types/SopHeader';
import './sopDocument.css'; // سنضع CSS هنا

interface SOPTemplateProps {
  children: ReactNode;          // أقسام الـSOP
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  // نسكب الـchildren في مصفوفة فعلية
  const arrayChildren = React.Children.toArray(children);

  // جهّز الهيدر
  const headerComponent = useMemo(() => {
    if (!headerData) return <div>No Header Data</div>;
    return (
      <Header
        issueDate={headerData.Issued_Date || ''}
        effectiveDate={headerData.Effective_Date || ''}
        revisionDate={headerData.Revision_Date || ''}
        codeNumber={headerData.Doc_Code || ''}
        versionNumber={headerData.Version || ''}
        pageNumber={headerData.Page_Number || '1'}
      />
    );
  }, [headerData]);

  // جهّز الفوتر
  const footerComponent = useMemo(() => {
    if (!headerData) return null;
    const preparedSignatureUrl = headerData?.prepared_by_sign || '';
    const reviewedSignatureUrl = headerData?.reviewed_by_sign || '';
    const approvedSignatureUrl = headerData?.approved_by_sign || '';

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
      <>
        <PreparedBySection
          preparedJobTitle="QA Associate"
          reviewedJobTitle="QA Supervisor"
          approvedJobTitle="QA Manager"
          preparedName={preparedName}
          reviewedName={reviewedName}
          approvedName={approvedName}
          stampImageUrl={headerData?.sop_stamp_url || './public/Stamps/QaApproval.svg'}
          preparedSignatureUrl={preparedSignatureUrl}
          reviewedSignatureUrl={reviewedSignatureUrl}
          approvedSignatureUrl={approvedSignatureUrl}
          prepared_date={headerData?.prepared_date}
          reviewed_date={headerData?.reviewed_date}
          approved_date={headerData?.approved_date}
        />
        <Footer />
      </>
    );
  }, [headerData]);

  // الآن نقسّم الـchildren على صفحات متتالية (صفحة = جدول)
  // مثلاً صفحة لكل قسم (يمكنك الجمع بين قسمين في صفحة واحدة إن شئت).
  // لاحظ أننا لا نحسب الارتفاع الفعلي؛ بل نقول قسم واحد = صفحة واحدة:
  const pages = arrayChildren.map((child) => [child]);

  // لو أردت ضم أكثر من قسم في الصفحة الواحدة، يمكنك تعديل هذا التقسيم.

  return (
    <div className="multi-page-container">
      {pages.map((pageSections, pageIndex) => (
        <table className="one-page" key={pageIndex}>
          <thead>
            <tr>
              <th>
                {/* نفس الهيدر في كل صفحة */}
                {headerComponent}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                {/* الأقسام الخاصة بهذه الصفحة */}
                {pageSections.map((section, i) => (
                  <div key={i} style={{ marginBottom: '20px' }}>
                    {section}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                {/* نفس الفوتر في كل صفحة */}
                {footerComponent}
              </td>
            </tr>
          </tfoot>
        </table>
      ))}
    </div>
  );
};

export default SOPTemplate;

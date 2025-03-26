// src/components/SOPTemplate.tsx
import React, { ReactNode, useMemo } from 'react';
import Header from './Header';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import { SopHeader } from '../types/SopHeader';
import './sopDocument.css'; // هنا ملف الستايل

interface SOPTemplateProps {
  children: ReactNode; // أقسام الـSOP
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  // تحضير بيانات الهيدر
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

  // تحضير الفوتر (يشمل PreparedBySection إن وجد)
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

  return (
    <div className="sop-wrapper">
      <table className="sop-table">
        <thead>
          <tr>
            <th>
              {headerComponent}
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td>
              {footerComponent}
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              {/* هنا سيوضع كل المحتوى (الأقسام) في نفس الـtbody 
                  وأي محتوى أطول من صفحة A4 سيتم تلقائياً قطعه إلى صفحة جديدة 
                  مع تكرار الهيدر والفوتر (في الطباعة أو عند استخدام معاينة الطباعة).
              */}
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SOPTemplate;

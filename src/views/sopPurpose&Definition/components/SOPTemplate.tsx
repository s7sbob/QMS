/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import Header from './Header';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import PaginatedSOPContent from './PaginatedSOPContent';
import { SopHeader } from '../types/SopHeader';

interface SOPTemplateProps {
  children: React.ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  const headerComponent = useMemo(() => {
    return headerData ? (
      <Header
        issueDate={headerData.Issued_Date || ''}
        effectiveDate={headerData.Effective_Date || ''}
        revisionDate={headerData.Revision_Date || ''}
        codeNumber={headerData.Doc_Code || ''}
        versionNumber={headerData.Version || ''}
        pageNumber={headerData.Page_Number || '1'}
      />
    ) : (
      <div>No Header Data</div>
    );
  }, [
    headerData?.Issued_Date,
    headerData?.Effective_Date,
    headerData?.Revision_Date,
    headerData?.Doc_Code,
    headerData?.Version,
    headerData?.Page_Number,
  ]);

  const footerComponent = useMemo(() => {
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
  }, [
    headerData?.status,
    headerData?.prepared_by_sign,
    headerData?.reviewed_by_sign,
    headerData?.approved_by_sign,
    headerData?.sop_stamp_url,
    headerData?.User_Data_Sop_header_Prepared_ByToUser_Data,
    headerData?.User_Data_Sop_header_reviewed_byToUser_Data,
    headerData?.User_Data_Sop_header_Approved_byToUser_Data,
    headerData?.prepared_date,
    headerData?.reviewed_date,
    headerData?.approved_date,
  ]);

  return (
    <div
      className="sop-document"
      style={{
        margin: 'auto',
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
      }}
    >
      <PaginatedSOPContent
        sections={React.Children.toArray(children)}
        header={headerComponent}
        footer={footerComponent}
        sectionHeight={300}
        pageHeight={1122}
      />
    </div>
  );
};

export default SOPTemplate;

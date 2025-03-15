import React from 'react';
import Header from '../../sopHeader/components/Header';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import PaginatedSOPContent from './PaginatedSOPContent';
import { SopHeader } from '../types/SopHeader';

interface SOPTemplateProps {
  children: React.ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  // محتوى الهيدر والفوتر (سيوضع في كل صفحة)
  const headerComponent =  headerData ? (    <Header
  issueDate={headerData.Issued_Date || ""}
  effectiveDate={headerData.Effective_Date || ""}
  revisionDate={headerData.Revision_Date || ""}
  codeNumber={headerData.Doc_Code || ""}
  versionNumber={headerData.Version || ""}
  pageNumber={headerData.Page_Number || "1"}
/>  ) : (
    <div>No Header Data</div>
  );
  const footerComponent = (
    <>
      <PreparedBySection
        preparedJobTitle="QA Associate"
        reviewedJobTitle="QA Supervisor"
        approvedJobTitle="QA Manager"
        preparedName="Syed Mazhar"
        reviewedName="Walid Nafea"
        approvedName="El Hassan Fathy"
        stampImageUrl="./public/Stamps/DraftCopy.svg"
        preparedSignatureUrl="./public/signatures/sign1.png"
        reviewedSignatureUrl="./public/signatures/sign2.png"
        approvedSignatureUrl="./public/signatures/sign3.png"
      />
      <Footer />
    </>
  );

  return (
    <div
      className="sop-document"
      style={{
        // يمكنك الاكتفاء بخلفية خفيفة للمستند أو إزالتها تمامًا
        // ولا داعي لوضع حدود أو أحجام هنا، لأننا وضعناها داخل PaginatedSOPContent
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

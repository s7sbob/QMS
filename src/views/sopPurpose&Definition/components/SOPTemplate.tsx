import React from "react";
import HeaderContainer from "./HeaderContainer";
import PreparedBySection from "./PreparedBySection";
import Footer from "./Footer";
import PaginatedSOPContent from "./PaginatedSOPContent";
import { SopHeader } from "../types/SopHeader";

interface SOPTemplateProps {
  children: React.ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  // محتوى الهيدر والفوتر (سيوضع في كل صفحة)
  const headerComponent = <HeaderContainer headerData={headerData} />;
  const footerComponent = (
    <>
      <PreparedBySection
        preparedJobTitle="QA Associate"
        reviewedJobTitle="QA Supervisor"
        approvedJobTitle="QA Manager"
        preparedName="Syed Mazhar"
        reviewedName="Walid Nafea"
        approvedName="El Hassan Fathy"
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
        margin: "auto",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        fontSize: 14
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

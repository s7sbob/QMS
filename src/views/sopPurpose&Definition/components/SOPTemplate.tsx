import React from "react";
import HeaderContainer from "./HeaderContainer";
import PreparedBySection from "./PreparedBySection";
import Footer from "./Footer";

interface SOPTemplateProps {
  children: React.ReactNode;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children }) => {
  return (
    <div
      style={{
        width: "210mm", // عرض A4
        minHeight: "297mm", // ارتفاع A4
        margin: "auto",
        padding: "10px",
        border: "1px solid #000",
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* الهيدر */}
      <HeaderContainer />

      {/* المحتوى الرئيسي: حيث سيتم عرض الأقسام (Purpose, Definitions, ...) */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>

      {/* قسم التوقيعات */}
      <div style={{ marginTop: "auto" }}>
        <PreparedBySection
          preparedJobTitle="QA Associate"
          reviewedJobTitle="QA Supervisor"
          approvedJobTitle="QA Manager"
          preparedName="Syed Mazhar"
          reviewedName="Walid Nafea"
          approvedName="El Hassan Fathy"
        />
      </div>

      {/* الفوتر */}
      <Footer />
    </div>
  );
};

export default SOPTemplate;

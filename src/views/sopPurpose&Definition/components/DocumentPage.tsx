// src/components/DocumentPage.tsx
import React from "react";
import HeaderContainer from "./HeaderContainer";
import PurposeSection from "./PurposeSection";
import DefinitionsSection from "./DefinitionsSection";
import PreparedBySection from "./PreparedBySection";
import Footer from "./Footer";

const DocumentPage: React.FC = () => {
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
      }}
    >
      {/* الهيدر */}
      <HeaderContainer />

      {/* المحتوى الرئيسي */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <PurposeSection />
        <DefinitionsSection />
      </div>

      {/* جزء التوقيعات */}
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

export default DocumentPage;

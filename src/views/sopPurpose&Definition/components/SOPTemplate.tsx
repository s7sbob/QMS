// src/components/SOPTemplate.tsx
import React from "react";
import HeaderContainer from "./HeaderContainer";
import PreparedBySection from "./PreparedBySection";
import Footer from "./Footer";

import { SopHeader } from "../types/SopHeader";

// نجعل الـ Interface يقبل headerData كخيار (يمكن أن يكون null)
interface SOPTemplateProps {
  children: React.ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
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
      {/* الهيدر: نمرر البيانات للمكوّن HeaderContainer */}
      <HeaderContainer headerData={headerData} />

      {/* المحتوى الرئيسي */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
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

export default SOPTemplate;

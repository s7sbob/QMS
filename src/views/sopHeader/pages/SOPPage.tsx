// src/pages/SOPPage.tsx
import React from "react";
import Header from "../components/Header";
import TitleSection from "../components/TitleSection";
import CompanyInfo from "../components/CompanyInfo";
import PreparedBySection from "../components/PreparedBySection";
import Footer from "../components/Footer";

const SOPPage: React.FC = () => {
  return (
    <div
      style={{
        width: "210mm",        // عرض A4
        minHeight: "297mm",    // ارتفاع A4
        margin: "auto",
        padding: "10px",
        border: "1px solid #000", // تغيير اللون إلى الأسود
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* الهيدر في أعلى الصفحة */}
      <Header
        issueDate="01/01/2025"
        effectiveDate="01/02/2025"
        revisionDate="01/03/2025"
        codeNumber="GEN-SOP-001"
        versionNumber="12"
        pageNumber="1 of 42"
      />

      {/* كتلة وسطية Flex-Grow تسمح بالتمدد لملء المساحة العمودية المتبقية */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // يُركّز عامودياً
        }}
      >
        {/* العنوان الرئيسي (TitleSection) */}
        <TitleSection />

        {/* معلومات الشركة (CompanyInfo) */}
        <CompanyInfo />
      </div>

      {/* الجزء السفلي الثابت (PreparedBySection + Footer) */}
      <div style={{ marginTop: "auto" }}>
        <PreparedBySection
          preparedJobTitle="QA Associate"
          reviewedJobTitle="QA Supervisor"
          approvedJobTitle="QA Manager"
          preparedName="Syed Mazhar"
          reviewedName="Walid Nafea"
          approvedName="El Hassan Fathy"
        />
        <Footer />
      </div>
    </div>
  );
};

export default SOPPage;

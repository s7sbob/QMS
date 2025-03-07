// src/components/CompanyInfo.tsx
import React from "react";

// يمكنك وضع رابط أو import للوجو حسب الحاجة
// import logo from "../assets/logo.png";

const CompanyInfo: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      {/* إذا لديك لوجو حقيقي: <img src={logo} alt="Company Logo" style={{ maxWidth: "150px" }} /> */}
      <h3 style={{ margin: "10px 0" }}>شركة الرعاية الصحية سقالة (Cigalah Healthcare Company)</h3>
      <h3 style={{ margin: "5px 0" }}>Healthcare Division</h3>
    </div>
  );
};

export default CompanyInfo;

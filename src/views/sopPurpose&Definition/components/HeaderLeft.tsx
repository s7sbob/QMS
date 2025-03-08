// src/components/HeaderLeft.tsx
import React from "react";
import { SopHeader } from "../types/SopHeader";

interface HeaderLeftProps {
  headerData?: SopHeader | null;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({ headerData }) => {
  // لو كان headerData غير متوفر بعد، استخدم قيم افتراضية
  const companyName = headerData?.compName || "Healthcare Division";

  return (
    <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "16px" }}>
      {companyName}
    </div>
  );
};

export default HeaderLeft;

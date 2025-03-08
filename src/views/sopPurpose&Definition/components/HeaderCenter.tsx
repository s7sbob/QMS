// src/components/HeaderCenter.tsx
import React from "react";
import { SopHeader } from "../types/SopHeader";

interface HeaderCenterProps {
  headerData?: SopHeader | null;
}

const HeaderCenter: React.FC<HeaderCenterProps> = ({ headerData }) => {
  const docTitle = headerData?.Doc_Title_en || "Documentation System";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
        Document Title: {docTitle}
      </div>
    </div>
  );
};

export default HeaderCenter;

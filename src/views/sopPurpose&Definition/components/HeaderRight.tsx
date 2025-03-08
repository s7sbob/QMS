// src/components/HeaderRight.tsx
import React from "react";
import { SopHeader } from "../types/SopHeader";

interface HeaderRightProps {
  headerData?: SopHeader | null;
}

const HeaderRight: React.FC<HeaderRightProps> = ({ headerData }) => {
  const docCode = headerData?.Doc_Code || "GEN-SOP-001";
  // ربما في الـ API لم نرَ "Version" مباشرةً، لكن ممكن تضيفه في الحقل NOTES أو غيره
  const version = "1.2"; // ثابت مثلاً أو إن كان يأتي من مكان آخر
  const pageInfo = "3 of 42"; // أو حسب الحاجة
  const manager = "QA Manager"; // مثال فقط

  return (
    <div style={{ textAlign: "right", fontSize: "14px" }}>
      <div>Code: {docCode}</div>
      <div>Version: {version}</div>
      <div>Page: {pageInfo}</div>
      <div>{manager}</div>
    </div>
  );
};

export default HeaderRight;

// src/pages/SOPFullDocument.tsx
import React, { useEffect, useState } from "react";
import axiosServices from "src/utils/axiosServices";

// استيراد القالب الذي يحتوي على الهيدر والفوتر والتوقيعات
import SOPTemplate from "../components/SOPTemplate";

// استيراد الأقسام الأخرى
import PurposeSection from "../components/PurposeSection";
import DefinitionsSection from "../components/DefinitionsSection";
import ScopeSection from "../components/ScopeSection";
import ProceduresSection from "../components/ProceduresSection";
import ResponsibilitiesSection from "../components/ResponsibilitiesSection";
import SafetyConcernsSection from "../components/SafetyConcernsSection";

// استيراد الواجهة (للتايبنج) - أو يمكنك تعريفها هنا
import { SopHeader } from "../types/SopHeader";

const SOPFullDocument: React.FC = () => {
  // حالة لتخزين بيانات الهيدر
  const [headerData, setHeaderData] = useState<SopHeader | null>(null);

  useEffect(() => {
    // جلب بيانات الهيدر
    axiosServices
      .get("/api/sopheader/getAllSopHeaders")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // نفترض أنك تريد أول عنصر فقط
          setHeaderData(res.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching sop-header data:", error);
      });
  }, []);

  return (
    <SOPTemplate headerData={headerData}>
      {/* بقية الأقسام */}
      <PurposeSection />
      <DefinitionsSection />
      <ScopeSection />
      <ProceduresSection />
      <ResponsibilitiesSection />
      <SafetyConcernsSection />
    </SOPTemplate>
  );
};

export default SOPFullDocument;

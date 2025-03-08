// src/pages/SOPFullDocument.tsx

import React from "react";
import SOPTemplate from "../components/SOPTemplate";

// الأقسام كلها:
import PurposeSection from "../components/PurposeSection";
import DefinitionsSection from "../components/DefinitionsSection";
import ScopeSection from "../components/ScopeSection";
import ProceduresSection from "../components/ProceduresSection";
import ResponsibilitiesSection from "../components/ResponsibilitiesSection";
import SafetyConcernsSection from "../components/SafetyConcernsSection";

const SOPFullDocument: React.FC = () => {
  return (
    <SOPTemplate>
      <PurposeSection />
      <DefinitionsSection />
      <ScopeSection />
      <ProceduresSection />
      <ResponsibilitiesSection />
      <SafetyConcernsSection />
      {/* إذا عندك أقسام أخرى، يمكنك إضافتها هنا */}
    </SOPTemplate>
  );
};

export default SOPFullDocument;

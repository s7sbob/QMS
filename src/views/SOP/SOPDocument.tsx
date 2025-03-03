import React from "react";
import { Box } from "@mui/material";

// استيراد المكوّنات الصغيرة
import SOPHeader from "./SOPHeader";
import SOPTitleSection from "./SOPTitleSection";
import SOPPreparedReviewApproved from "./SOPPreparedReviewApproved";
import SOPFooter from "./SOPFooter";

const SOPDocument: React.FC = () => {
  return (
    <Box
      sx={{
        width: "210mm",      // عرض A4 تقريبي
        minHeight: "297mm",  // طول A4 تقريبي
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #000",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        fontSize: "14px",
      }}
    >
      {/* 1) Header */}
      <SOPHeader />

      {/* 2) Title Section */}
      <SOPTitleSection />

      {/* 3) Prepared/Reviewed/Approved Table */}
      <SOPPreparedReviewApproved />

      {/* 4) Footer */}
      <SOPFooter />
    </Box>
  );
};

export default SOPDocument;

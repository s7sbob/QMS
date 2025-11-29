// src/views/documentation/components/DistributionFormHeader.tsx
import React from "react";

interface DistributionFormHeaderProps {
  documentTitle: string;
  codeNumber: string;
  versionNumber: string;
  pageNumber: string;
}

const DistributionFormHeader: React.FC<DistributionFormHeaderProps> = ({
  documentTitle,
  codeNumber,
  versionNumber,
  pageNumber,
}) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginBottom: "10px" }}>
      <tbody>
        <tr>
          <td style={{ width: "25%", border: "1px solid #000", padding: "15px", verticalAlign: "middle" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <img
                src="/logo.png"
                alt="Company Logo"
                style={{ maxWidth: "120px", height: "auto" }}
              />
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#666", textAlign: "center" }}>
                Healthcare Division
              </div>
            </div>
          </td>
          <td style={{ width: "50%", border: "1px solid #000", padding: "15px", textAlign: "center", verticalAlign: "middle" }}>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "14px" }}>Document Title: {documentTitle}</strong>
            </div>
            <div style={{ fontSize: "13px", direction: "rtl" }}>
              عنوان الوثيقة: نظام التوثيق
            </div>
          </td>
          <td style={{ width: "25%", border: "1px solid #000", padding: "10px", verticalAlign: "middle" }}>
            <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
              <div><strong>Code #</strong> : {codeNumber}</div>
              <div><strong>Version #:</strong> {versionNumber}</div>
              <div><strong>Page #</strong> : {pageNumber}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DistributionFormHeader;

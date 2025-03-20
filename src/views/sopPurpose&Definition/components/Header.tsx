// src/components/Header.tsx
import React from "react";

interface HeaderProps {
  issueDate: string;
  effectiveDate: string;
  revisionDate: string;
  codeNumber: string;
  versionNumber: string;
  pageNumber: string;
}

const Header: React.FC<HeaderProps> = ({
  issueDate,
  effectiveDate,
  revisionDate,
  codeNumber,
  versionNumber,
  pageNumber,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        border: "1px solid #000",
      }}
    >
      {/* الجدول الأول (يسار) */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #000",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Issue Date
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :تاريخ الإصدار
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {issueDate}
              </td>
            </tr>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Effective Date
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :تاريخ النفاذ
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {effectiveDate}
              </td>
            </tr>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Revision Date
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :تاريخ المراجعة
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {revisionDate}
              </td>
            </tr>
          </thead>
        </table>
      </div>

      {/* المساحة الوسطى لاسم الشركة */}
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid #000",
        }}
      >
        <h3 style={{ textAlign: "center", margin: 0 }}>
          Cigalah Healthcare Company
          <br />
          Healthcare Division
        </h3>
      </div>

      {/* الجدول الثاني (يمين) */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #000",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Code #:
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :كود الوثيقة
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {codeNumber}
              </td>
            </tr>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Version #:
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :رقم الإصدار
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {versionNumber}
              </td>
            </tr>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "left" }}>
                Page #:
              </th>
              <th style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>
                :رقم الصفحة
              </th>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}
              >
                {pageNumber}
              </td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Header;

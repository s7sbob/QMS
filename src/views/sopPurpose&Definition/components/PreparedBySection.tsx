import React from "react";

interface PreparedBySectionProps {
  preparedJobTitle: string;
  reviewedJobTitle: string;
  approvedJobTitle: string;
  preparedName: string;
  reviewedName: string;
  approvedName: string;
}

const PreparedBySection: React.FC<PreparedBySectionProps> = ({
  preparedJobTitle,
  reviewedJobTitle,
  approvedJobTitle,
  preparedName,
  reviewedName,
  approvedName,
}) => {
  return (
    <table
      style={{
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        marginTop: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#274F8E", color: "#fff" }}>
          <th
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              width: "25%",
            }}
            colSpan={2}
          ></th>
          <th
            style={{
              border: "1px solid #000",
              padding: "4px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            Prepared by
          </th>
          <th
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            الإعداد
          </th>
          <th
            style={{
              border: "1px solid #000",
              padding: "2px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            Reviewed by
          </th>
          <th
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            المراجعة
          </th>
          <th
            style={{
              border: "1px solid #000",
              padding: "2px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            Approved by
          </th>
          <th
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              width: "12.5%",
            }}
          >
            الاعتماد
          </th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ backgroundColor: "#D9E1F2" }}>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Job Title
          </td>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            المسمى الوظيفي
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {preparedJobTitle}
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {reviewedJobTitle}
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {approvedJobTitle}
          </td>
        </tr>
        <tr style={{ backgroundColor: "#D9E1F2" }}>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Name
          </td>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            الاسم
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {preparedName}
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {reviewedName}
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {approvedName}
          </td>
        </tr>
        <tr style={{ backgroundColor: "#D9E1F2" }}>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Signature
          </td>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            التوقيع
          </td>
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
        </tr>
        <tr style={{ backgroundColor: "#D9E1F2" }}>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Date
          </td>
          <td
            style={{
              border: "1px solid #000",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            التاريخ
          </td>
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
          <td colSpan={2} style={{ border: "1px solid #000", padding: "8px" }} />
        </tr>
      </tbody>
    </table>
  );
};

export default PreparedBySection;

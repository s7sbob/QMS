// src/components/TitleSection.tsx
import React from "react";

const TitleSection: React.FC = () => {
  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      {/* الشريط العلوي */}
      <div
        style={{
          backgroundColor: "#C7DAF2", // لون أزرق فاتح قريب من الصورة
          padding: "10px",
        }}
      >
        <h3 style={{ margin: 0, color: "#000" }}>Standard Operating Procedure</h3>
      </div>

      {/* الشريط الثاني */}
      <div
        style={{
          backgroundColor: "#E7EFFA",
          padding: "15px 10px",
        }}
      >
        <h4 style={{ margin: "5px 0", color: "#000" }}>Documentation System</h4>
        <h4 style={{ margin: "5px 0", color: "#000" }}>نظام التوثيق</h4>
      </div>
    </div>
  );
};

export default TitleSection;

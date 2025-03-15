import React from "react";

interface PaginatedSOPContentProps {
  sections: React.ReactNode[];
  header: React.ReactNode;
  footer: React.ReactNode;
  sectionHeight?: number;
  pageHeight?: number;
}

const PaginatedSOPContent: React.FC<PaginatedSOPContentProps> = ({
  sections,
  header,
  footer,
  sectionHeight = 300,
  pageHeight = 1122,
}) => {
  const pages: React.ReactNode[][] = [];
  let currentPage: React.ReactNode[] = [];
  let currentHeight = 0;

  sections.forEach((section) => {
    currentHeight += sectionHeight;
    if (currentHeight > pageHeight) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = sectionHeight;
    }
    currentPage.push(section);
  });
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <>
      {pages.map((pageSections, i) => (
        <div
          key={i}
          className="page"
          style={{
            width: "794px",
            height: "1123px",
            border: "1px solid #000",
            margin: "0 auto 75px auto", // توسيط الصفحة + مسافة من الأسفل
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            position: "relative",
          }}
        >
          {/* الهيدر */}
          <div style={{ flexShrink: 0 }}>{header}</div>

          {/* المحتوى في المنتصف */}
          <div style={{ flexGrow: 1 }}>
            {pageSections.map((section, j) => (
              <div key={j} style={{ marginBottom: "10px" }}>
                {section}
              </div>
            ))}
          </div>

          {/* الفوتر */}
          <div style={{ flexShrink: 0 }}>{footer}</div>
        </div>
      ))}
    </>
  );
};

export default PaginatedSOPContent;

import React from "react";

interface PaginatedSOPContentProps {
  sections: React.ReactNode[];
  header: React.ReactNode;
  footer: React.ReactNode;
  sectionHeight?: number; // تقديري لكل قسم
  pageHeight?: number;    // ارتفاع المحتوى لكل صفحة
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
            width: "210mm",
            height: "297mm",
            margin: "0 auto 20px auto",
            border: "1px solid #000",
            position: "relative",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
          }}
        >
          <div className="header" style={{ flexShrink: 0 }}>
            {header}
          </div>
          <div className="content" style={{ flexGrow: 1, overflow: "hidden", padding: "10px" }}>
            {pageSections.map((section, j) => (
              <div key={j} className="section" style={{ marginBottom: "10px" }}>
                {section}
              </div>
            ))}
          </div>
          <div className="footer" style={{ flexShrink: 0 }}>
            {footer}
          </div>
        </div>
      ))}
    </>
  );
};

export default PaginatedSOPContent;

import React from 'react';

interface PaginatedSOPContentProps {
  sections: React.ReactNode[];
  header: React.ReactNode;
  footer: React.ReactNode;
  sectionHeight?: number; // تقديري لكل قسم
  pageHeight?: number; // ارتفاع الصفحة الكلي (مثلاً 1122px للمحتوى)
}

const PaginatedSOPContent: React.FC<PaginatedSOPContentProps> = ({
  sections,
  header,
  footer,
  sectionHeight,
  pageHeight,
}) => {
  // Default values if props are not provided
  const effectiveSectionHeight = sectionHeight ?? 300;
  const effectivePageHeight = pageHeight ?? 1122;

  // تعريف ارتفاع الهيدر والفوتر (يمكنك تعديلهم حسب الحاجة)
  const headerHeight = 100;
  const footerHeight = 80;

  // المساحة المتاحة للمحتوى في كل صفحة
  const availableContentHeight = effectivePageHeight - (headerHeight + footerHeight);

  const pages: React.ReactNode[][] = [];
  let currentPage: React.ReactNode[] = [];
  let currentHeight = 0;

  sections.forEach((section) => {
    currentHeight += effectiveSectionHeight;
    if (currentHeight > availableContentHeight) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = effectiveSectionHeight; // إعادة تعيين الارتفاع للقسم الحالي
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
            width: '210mm',
            height: '297mm',
            position: 'relative',
            margin: '0 auto',
            boxSizing: 'border-box',
            pageBreakAfter: 'always',
            border: '1px solid #000',
            overflow: 'hidden',
          }}
        >
          {/* الهيدر ثابت أعلى الصفحة */}
          <div
            className="header"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: headerHeight,
              borderBottom: '1px solid #000',
              boxSizing: 'border-box',
            }}
          >
            {header}
          </div>
          {/* المحتوى في الوسط يُمتد ليملأ المساحة المتبقية */}
          <div
            className="content"
            style={{
              position: 'absolute',
              top: headerHeight,
              bottom: footerHeight,
              left: 0,
              right: 0,
              overflow: 'hidden',
            }}
          >
            {pageSections.map((section, j) => (
              <div key={j} className="section" style={{ minHeight: effectiveSectionHeight }}>
                {section}
              </div>
            ))}
          </div>
          {/* الفوتر ثابت أسفل الصفحة مع ترقيم الصفحة */}
          <div
            className="footer"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: footerHeight,
              borderTop: '1px solid #000',
              boxSizing: 'border-box',
              textAlign: 'center',
              padding: '5px',
            }}
          >
            {footer}
            <div style={{ marginTop: '5px', fontSize: '12px' }}>Page {i + 1}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PaginatedSOPContent;

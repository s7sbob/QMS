// src/components/SOPPaginatedDocument.tsx
import React, { ReactNode, useState, useRef, useMemo, useLayoutEffect } from 'react';
import SOPCoverPage from './SOPCoverPage';
import SOPContentPageHeader from './SOPContentPageHeader';
import SOPTableOfContents, { TableOfContentsEntry } from './SOPTableOfContents';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import { SopHeader } from '../types/SopHeader';
import './sopDocument.css';

interface SOPPaginatedDocumentProps {
  children: ReactNode;
  headerData?: SopHeader | null;
}

// A4 page content height (excluding header and footer) in pixels
// A4 = 297mm, at 96 DPI ≈ 1123px. Minus header (~80px) and footer (~200px) = ~843px usable
const CONTENT_HEIGHT_PER_PAGE = 750;

interface PageContent {
  pageNumber: number;
  startIndex: number;
  endIndex: number;
}

const SOPPaginatedDocument: React.FC<SOPPaginatedDocumentProps> = ({ children, headerData }) => {
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<PageContent[]>([]);
  const [isReady, setIsReady] = useState(false);
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  // Parse table of contents from headerData
  const tableOfContents = useMemo<TableOfContentsEntry[]>(() => {
    if (!headerData?.Content_Table) return [];
    try {
      return JSON.parse(headerData.Content_Table);
    } catch (e) {
      console.error('Error parsing Content_Table:', e);
      return [];
    }
  }, [headerData?.Content_Table]);

  // Always show TOC page (second page after cover)
  const hasTocPage = true;

  // Prepare footer data
  const footerData = useMemo(() => {
    if (!headerData) return null;

    const preparedName = headerData?.User_Data_Sop_header_Prepared_ByToUser_Data
      ? `${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.FName} ${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.LName}`
      : '';
    const reviewedName = headerData?.User_Data_Sop_header_reviewed_byToUser_Data
      ? `${headerData.User_Data_Sop_header_reviewed_byToUser_Data.FName} ${headerData.User_Data_Sop_header_reviewed_byToUser_Data.LName}`
      : '';
    const approvedName = headerData?.User_Data_Sop_header_Approved_byToUser_Data
      ? `${headerData.User_Data_Sop_header_Approved_byToUser_Data.FName} ${headerData.User_Data_Sop_header_Approved_byToUser_Data.LName}`
      : '';

    return {
      preparedName,
      reviewedName,
      approvedName,
      stampImageUrl: headerData?.sop_stamp_url || './public/Stamps/QaApproval.svg',
      preparedSignatureUrl: headerData?.prepared_by_sign || '',
      reviewedSignatureUrl: headerData?.reviewed_by_sign || '',
      approvedSignatureUrl: headerData?.approved_by_sign || '',
      prepared_date: headerData?.prepared_date,
      reviewed_date: headerData?.reviewed_date,
      approved_date: headerData?.approved_date,
    };
  }, [headerData]);

  // Calculate page breaks after content is rendered
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (!measureContainerRef.current || childrenArray.length === 0) {
        setIsReady(true);
        return;
      }

      const container = measureContainerRef.current;
      const elements = Array.from(container.children) as HTMLElement[];

      const pages: PageContent[] = [];
      let currentPageHeight = 0;
      let currentPageStartIndex = 0;
      // Start from page 3 if TOC exists (page 1 = cover, page 2 = TOC), otherwise page 2
      let pageNum = hasTocPage ? 3 : 2;

      elements.forEach((element, index) => {
        const elementHeight = element.getBoundingClientRect().height + 15; // Add margin

        if (currentPageHeight + elementHeight > CONTENT_HEIGHT_PER_PAGE && index > currentPageStartIndex) {
          // Save current page
          pages.push({
            pageNumber: pageNum,
            startIndex: currentPageStartIndex,
            endIndex: index - 1,
          });
          pageNum++;
          currentPageStartIndex = index;
          currentPageHeight = elementHeight;
        } else {
          currentPageHeight += elementHeight;
        }
      });

      // Add last page with remaining content
      if (currentPageStartIndex < elements.length) {
        pages.push({
          pageNumber: pageNum,
          startIndex: currentPageStartIndex,
          endIndex: elements.length - 1,
        });
      }

      // Ensure at least one content page
      if (pages.length === 0 && childrenArray.length > 0) {
        pages.push({
          pageNumber: hasTocPage ? 3 : 2,
          startIndex: 0,
          endIndex: childrenArray.length - 1,
        });
      }

      setPageBreaks(pages);
      setIsReady(true);
    }, 100); // Small delay to ensure content is rendered

    return () => clearTimeout(timer);
  }, [childrenArray, hasTocPage]);

  // Total pages = content pages + cover page + TOC page (if exists)
  const totalPages = pageBreaks.length + 1 + (hasTocPage ? 1 : 0);

  // Render page footer
  const renderPageFooter = () => {
    if (!footerData) return null;

    return (
      <div className="content-footer-section">
        <PreparedBySection
          preparedJobTitle="QA Associate"
          reviewedJobTitle="QA Supervisor"
          approvedJobTitle="QA Manager"
          preparedName={footerData.preparedName}
          reviewedName={footerData.reviewedName}
          approvedName={footerData.approvedName}
          stampImageUrl={footerData.stampImageUrl}
          preparedSignatureUrl={footerData.preparedSignatureUrl}
          reviewedSignatureUrl={footerData.reviewedSignatureUrl}
          approvedSignatureUrl={footerData.approvedSignatureUrl}
          prepared_date={footerData.prepared_date}
          reviewed_date={footerData.reviewed_date}
          approved_date={footerData.approved_date}
        />
        <Footer />
      </div>
    );
  };

  if (!headerData) {
    return (
      <div className="sop-document-wrapper">
        <div className="sop-page">No Header Data</div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden measurement container - always render to measure */}
      <div
        ref={measureContainerRef}
        className="sop-measure-container"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '180mm', // A4 width minus padding
          visibility: 'hidden',
        }}
      >
        {childrenArray}
      </div>

      {/* Visible paginated document */}
      <div className="sop-document-wrapper">
        {/* Page 1: Cover Page */}
        <SOPCoverPage headerData={headerData} totalPages={totalPages || 2} />

        {/* Page 2: Table of Contents (if exists) */}
        {hasTocPage && (
          <SOPTableOfContents
            headerData={headerData}
            totalPages={totalPages}
            entries={tableOfContents}
          />
        )}

        {/* Content Pages */}
        {isReady && pageBreaks.map((page) => (
          <div key={page.pageNumber} className="sop-page sop-content-page">
            <SOPContentPageHeader
              headerData={headerData}
              currentPage={page.pageNumber}
              totalPages={totalPages}
            />

            <div className="sop-content-area">
              {childrenArray.slice(page.startIndex, page.endIndex + 1)}
            </div>

            {renderPageFooter()}
          </div>
        ))}

        {/* Fallback: Show all content on one page if pagination not ready */}
        {!isReady && (
          <div className="sop-page sop-content-page">
            <SOPContentPageHeader
              headerData={headerData}
              currentPage={hasTocPage ? 3 : 2}
              totalPages={hasTocPage ? 3 : 2}
            />
            <div className="sop-content-area">
              {childrenArray}
            </div>
            {renderPageFooter()}
          </div>
        )}
      </div>
    </>
  );
};

export default SOPPaginatedDocument;

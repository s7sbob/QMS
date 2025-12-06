// src/components/SOPPaginatedDocument.tsx
import React, { ReactNode, useState, useRef, useMemo, useEffect, useCallback } from 'react';
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

// A4 page layout constants (in pixels)
const AVAILABLE_CONTENT_HEIGHT = 720;

interface PageData {
  pageNumber: number;
  startIndex: number;
  endIndex: number;
}

const SOPPaginatedDocument: React.FC<SOPPaginatedDocumentProps> = ({ children, headerData }) => {
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [isReady, setIsReady] = useState(false);
  const hasMeasured = useRef(false);

  // Parse table of contents
  const tableOfContents = useMemo<TableOfContentsEntry[]>(() => {
    if (!headerData?.Content_Table) return [];
    try {
      return JSON.parse(headerData.Content_Table);
    } catch (e) {
      console.error('Error parsing Content_Table:', e);
      return [];
    }
  }, [headerData?.Content_Table]);

  const hasTocPage = true;
  const startPageNumber = hasTocPage ? 3 : 2;

  // Footer data
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

    const preparedSignatureUrl =
      headerData?.User_Data_Sop_header_Prepared_ByToUser_Data?.signUrl ||
      headerData?.prepared_by_sign || '';

    const sopStatus = parseInt(headerData?.status || '0', 10);
    const reviewedSignatureUrl = sopStatus >= 4
      ? (headerData?.User_Data_Sop_header_reviewed_byToUser_Data?.signUrl ||
         headerData?.reviewed_by_sign || '')
      : '';

    const approvedSignatureUrl =
      headerData?.User_Data_Sop_header_Approved_byToUser_Data?.signUrl ||
      headerData?.approved_by_sign || '';

    return {
      preparedName,
      reviewedName,
      approvedName,
      stampImageUrl: headerData?.sop_stamp_url || './public/Stamps/QaApproval.svg',
      preparedSignatureUrl,
      reviewedSignatureUrl,
      approvedSignatureUrl,
      prepared_date: headerData?.prepared_date,
      reviewed_date: headerData?.reviewed_date,
      approved_date: headerData?.approved_date,
    };
  }, [headerData]);

  // Measure and distribute elements - only runs once
  useEffect(() => {
    if (hasMeasured.current || !headerData) return;

    const measureAndDistribute = () => {
      const container = measureContainerRef.current;
      if (!container) {
        console.log('No measurement container yet');
        return;
      }

      // Find all pageable elements
      const pageableElements = container.querySelectorAll('.pageable-section-header, .pageable-content-row');

      if (pageableElements.length === 0) {
        console.log('No pageable elements found, retrying...');
        return; // Will retry
      }

      console.log(`Found ${pageableElements.length} pageable elements`);
      hasMeasured.current = true;

      // Measure each element
      const measurements: { index: number; height: number }[] = [];
      pageableElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const height = rect.height + 8;
        measurements.push({ index, height });
        console.log(`Element ${index}: height = ${rect.height}px`);
      });

      // Distribute across pages
      const newPages: PageData[] = [];
      let currentPageStart = 0;
      let currentPageHeight = 0;
      let pageNum = startPageNumber;

      measurements.forEach(({ height }, i) => {
        if (currentPageHeight + height > AVAILABLE_CONTENT_HEIGHT && i > currentPageStart) {
          newPages.push({
            pageNumber: pageNum,
            startIndex: currentPageStart,
            endIndex: i - 1,
          });
          console.log(`Page ${pageNum}: elements ${currentPageStart} to ${i - 1}, height: ${currentPageHeight}px`);

          pageNum++;
          currentPageStart = i;
          currentPageHeight = 0;
        }
        currentPageHeight += height;
      });

      // Add final page
      if (currentPageStart < measurements.length) {
        newPages.push({
          pageNumber: pageNum,
          startIndex: currentPageStart,
          endIndex: measurements.length - 1,
        });
        console.log(`Page ${pageNum} (final): elements ${currentPageStart} to ${measurements.length - 1}, height: ${currentPageHeight}px`);
      }

      if (newPages.length === 0) {
        newPages.push({
          pageNumber: startPageNumber,
          startIndex: 0,
          endIndex: Math.max(0, measurements.length - 1),
        });
      }

      console.log(`Total pages: ${newPages.length}`);
      setPages(newPages);
      setIsReady(true);
    };

    // Retry mechanism
    let retryCount = 0;
    const maxRetries = 10;

    const tryMeasure = () => {
      if (hasMeasured.current) return;

      measureAndDistribute();

      if (!hasMeasured.current && retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryMeasure, 300);
      } else if (!hasMeasured.current) {
        // Fallback: show all content on one page
        console.warn('Max retries reached, showing all content');
        hasMeasured.current = true;
        setPages([{ pageNumber: startPageNumber, startIndex: 0, endIndex: 999 }]);
        setIsReady(true);
      }
    };

    // Start measuring after initial render
    const timeoutId = setTimeout(tryMeasure, 500);

    return () => clearTimeout(timeoutId);
  }, [headerData, startPageNumber]); // Only depend on headerData, not children

  // Get page content
  const getPageContent = useCallback((pageData: PageData): ReactNode[] => {
    const container = measureContainerRef.current;
    if (!container) return [];

    const pageableElements = container.querySelectorAll('.pageable-section-header, .pageable-content-row');
    const elements: ReactNode[] = [];

    for (let i = pageData.startIndex; i <= pageData.endIndex && i < pageableElements.length; i++) {
      const element = pageableElements[i];
      elements.push(
        <div
          key={`page-${pageData.pageNumber}-element-${i}`}
          className={element.className}
          dangerouslySetInnerHTML={{ __html: element.innerHTML }}
        />
      );
    }

    return elements;
  }, []);

  // Total pages
  const totalPages = Math.max(pages.length, 1) + 1 + (hasTocPage ? 1 : 0);

  // Render footer
  const renderPageFooter = useCallback(() => {
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
  }, [footerData]);

  if (!headerData) {
    return (
      <div className="sop-document-wrapper">
        <div className="sop-page">No Header Data</div>
      </div>
    );
  }

  return (
    <div className="sop-document-wrapper">
      {/* Hidden measurement container */}
      <div
        ref={measureContainerRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '170mm',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1000,
        }}
      >
        {children}
      </div>

      {/* Cover Page */}
      <SOPCoverPage headerData={headerData} totalPages={totalPages} />

      {/* Table of Contents */}
      {hasTocPage && (
        <SOPTableOfContents
          headerData={headerData}
          totalPages={totalPages}
          entries={tableOfContents}
        />
      )}

      {/* Content Pages */}
      {isReady && pages.map((pageData) => (
        <div key={`page-${pageData.pageNumber}`} className="sop-page sop-content-page">
          <SOPContentPageHeader
            headerData={headerData}
            currentPage={pageData.pageNumber}
            totalPages={totalPages}
          />
          <div className="sop-content-area">
            {getPageContent(pageData)}
          </div>
          {renderPageFooter()}
        </div>
      ))}

      {/* Loading */}
      {!isReady && (
        <div className="sop-page sop-content-page">
          <SOPContentPageHeader
            headerData={headerData}
            currentPage={startPageNumber}
            totalPages={startPageNumber}
          />
          <div className="sop-content-area" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '10px',
            minHeight: '400px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p>Preparing document...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
          {renderPageFooter()}
        </div>
      )}
    </div>
  );
};

export default SOPPaginatedDocument;

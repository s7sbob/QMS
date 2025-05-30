// src/views/sopPurpose&Definition/Pages/A4PageContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import './A4style.css';
interface A4PageContainerProps {
  children: React.ReactNode;
}

const A4_HEIGHT = 1123; // Full A4 height at 96 DPI
const PADDING = 76; // ~20mm usable padding
const USABLE_HEIGHT = A4_HEIGHT - PADDING;

const A4PageContainer: React.FC<A4PageContainerProps> = ({ children }) => {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<React.ReactNode[][]>([]);

  const paginate = () => {
    if (!hiddenRef.current) return;

    const domChildren = Array.from(hiddenRef.current.children);
    const reactChildren = React.Children.toArray(children);
    const newPages: React.ReactNode[][] = [];

    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;

    domChildren.forEach((node, index) => {
      const height = (node as HTMLElement).getBoundingClientRect().height;

      if (currentHeight + height > USABLE_HEIGHT && currentPage.length > 0) {
        newPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(reactChildren[index]);
      currentHeight += height;
    });

    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages);
  };

  useEffect(() => {
    // Delay to allow layout + fonts to fully render
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => paginate());
    }, 200);

    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <>
      <div
        ref={hiddenRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -9999,
          width: '210mm',
        }}
      >
        {children}
      </div>

      <div className="a4-document">
        {pages.map((page, index) => (
          <div key={index} className="a4-page">
            {page}
            <div className="page-footer">
              Page {index + 1} of {pages.length}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default A4PageContainer;

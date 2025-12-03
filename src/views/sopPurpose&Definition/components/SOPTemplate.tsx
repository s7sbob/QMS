// src/components/SOPTemplate.tsx
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import SOPPaginatedDocument from './SOPPaginatedDocument';
import { SopHeader } from '../types/SopHeader';
import './sopDocument.css';

interface SOPTemplateProps {
  children: ReactNode;
  headerData?: SopHeader | null;
}

const SOPTemplate: React.FC<SOPTemplateProps> = ({ children, headerData }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle image click to show preview
  const handleImageClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      // Check if it's within our SOP document content
      const isInSopContent = target.closest('.sop-document-wrapper') ||
                             target.closest('.MuiTableCell-root');
      if (isInSopContent) {
        e.preventDefault();
        e.stopPropagation();
        const imgSrc = (target as HTMLImageElement).src;
        setPreviewImage(imgSrc);
      }
    }
  }, []);

  // Handle closing the preview
  const handleClosePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  // Handle keyboard escape to close preview
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && previewImage) {
      setPreviewImage(null);
    }
  }, [previewImage]);

  // Add event listeners
  useEffect(() => {
    document.addEventListener('click', handleImageClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleImageClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleImageClick, handleKeyDown]);

  return (
    <>
      <SOPPaginatedDocument headerData={headerData}>
        {children}
      </SOPPaginatedDocument>

      {/* Image Preview Overlay */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={handleClosePreview}>
          <span className="image-preview-close" onClick={handleClosePreview}>
            &times;
          </span>
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default SOPTemplate;

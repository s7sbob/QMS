// src/components/PDFPreview.tsx
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFPreviewProps {
  pdfUrl: string;
  width?: number;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ pdfUrl, width = 350 }) => {
  return (
    <Document file={pdfUrl}>
      <Page pageNumber={1} width={width} />
    </Document>
  );
};

export default PDFPreview;

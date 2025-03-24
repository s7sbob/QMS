// src/components/PDFViewer.tsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  Box,
  IconButton,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconMenu } from '@tabler/icons-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  };

  const goToPrevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () =>
    setPageNumber((prev) => (numPages && prev < numPages ? prev + 1 : prev));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handlePageSelect = (page: number) => {
    setPageNumber(page);
    setDrawerOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1}>
            <IconChevronLeft />
          </IconButton>
          <IconButton onClick={goToNextPage} disabled={numPages ? pageNumber >= numPages : false}>
            <IconChevronRight />
          </IconButton>
          <Typography variant="body1" component="span" ml={2}>
            Page {pageNumber} of {numPages}
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleDrawerToggle} startIcon={<IconMenu />}>
            Table of Contents
          </Button>
          <Button variant="outlined" onClick={() => window.print()} sx={{ ml: 2 }}>
            Print
          </Button>
        </Box>
      </Box>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Pages
          </Typography>
          <List>
            {numPages &&
              Array.from(new Array(numPages), (_el, index) => (
                <ListItem key={`page-${index + 1}`} disablePadding>
                  <ListItemButton onClick={() => handlePageSelect(index + 1)}>
                    <ListItemText primary={`Page ${index + 1}`} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PDFViewer;

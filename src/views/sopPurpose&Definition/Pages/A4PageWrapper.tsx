// src/components/A4PageWrapper.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface A4PageWrapperProps {
  children: React.ReactNode;
  pageId: string;
  pageNumber: number;
  totalPages: number;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({
  children,
  pageId,
  pageNumber,
  totalPages,
}) => {
  const topBottomMarginAreaHeight = '20mm'; // Simulates top/bottom margin space for text
  const sideMargin = '20mm'; // Simulates side margins

  return (
    <Paper
      id={pageId}
      elevation={3}
      sx={{
        width: '210mm',
        minHeight: '297mm', // Ensures it's at least A4 height, but can GROW taller
        margin: '10mm auto', // Space between pages, centers the page
        border: '1px solid #666',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // No overflow: 'hidden' or 'auto' at this level, allow it to grow
      }}
    >
      {/* Top "Margin" Area: Page ID */}
      <Box
        sx={{
          padding: `calc(${topBottomMarginAreaHeight} / 2) ${sideMargin} 0 ${sideMargin}`,
          flexShrink: 0, // Prevent this area from shrinking
          height: topBottomMarginAreaHeight, // Fixed height for this text area
          boxSizing: 'border-box',
          display: 'flex', // Added for vertical alignment if needed
          alignItems: 'center', // Vertically center ID text
        }}
      >
        <Typography variant="caption" sx={{ color: '#555' }}>
          ID: {pageId}
        </Typography>
      </Box>

      {/* Content Area (will determine the Paper's actual height if content > A4) */}
      <Box
        sx={{
          flexGrow: 1, // Allows this box to take up space, especially if content is shorter than minHeight
          padding: `0 ${sideMargin}`, // Side padding for the content itself
          // No overflowY: 'auto' here - content will expand the Paper
        }}
      >
        {children}
      </Box>

      {/* Bottom "Margin" Area: Page Number */}
      <Box
        sx={{
          padding: `0 ${sideMargin} calc(${topBottomMarginAreaHeight} / 2) ${sideMargin}`,
          textAlign: 'center',
          flexShrink: 0, // Prevent this area from shrinking
          height: topBottomMarginAreaHeight, // Fixed height for this text area
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-end', // Align text to the "bottom" of this fixed-height area
          justifyContent: 'center',
          // marginTop: 'auto' // This can help push the footer down if content is very short
          // and the overall Paper is at minHeight.
        }}
      >
        <Typography variant="caption" sx={{ color: '#555' }}>
          Page {pageNumber} of {totalPages}
        </Typography>
      </Box>
    </Paper>
  );
};

export default A4PageWrapper;

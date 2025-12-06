// src/layouts/full/shared/footer/AppFooter.tsx
import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import { APP_VERSION } from 'src/config/version';

const AppFooter: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className="no-print"
      sx={{
        py: 1.5,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.background.paper
          : theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        &copy; {currentYear} Quality Management System. All rights reserved.
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: 'monospace',
        }}
      >
        <Link
          href="/changelog"
          color="inherit"
          underline="hover"
          sx={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            // Could open a modal or navigate to changelog page
            console.log('Version:', APP_VERSION.display);
          }}
        >
          {APP_VERSION.display}
        </Link>
      </Typography>
    </Box>
  );
};

export default AppFooter;

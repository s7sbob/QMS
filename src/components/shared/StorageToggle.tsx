import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { StorageType } from 'src/context/StorageContext';

// AWS Logo SVG
const AwsLogo = () => (
  <svg width="32" height="20" viewBox="0 0 64 40" fill="currentColor">
    <path d="M18.5 21.5c0 .8.1 1.4.3 1.9.2.4.5.9.9 1.4.1.2.2.3.2.5 0 .2-.1.4-.4.6l-1.3.9c-.2.1-.3.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-.9-.2-.3-.4-.7-.6-1.1-1.5 1.8-3.4 2.7-5.7 2.7-1.6 0-2.9-.5-3.9-1.4-.9-.9-1.4-2.2-1.4-3.7 0-1.7.6-3 1.8-4.1 1.2-1 2.8-1.6 4.8-1.6.7 0 1.4 0 2.1.1.7.1 1.5.2 2.3.4v-1.5c0-1.5-.3-2.5-.9-3.1-.6-.6-1.7-.9-3.2-.9-.7 0-1.4.1-2.1.3-.7.2-1.4.4-2.1.7-.3.1-.6.2-.7.3-.1 0-.3.1-.4.1-.3 0-.5-.2-.5-.7v-1c0-.4.1-.6.2-.8.1-.2.4-.3.7-.5.7-.4 1.6-.7 2.5-.9.9-.2 1.9-.4 3-.4 2.3 0 4 .5 5.1 1.6 1.1 1.1 1.6 2.7 1.6 4.9v6.4h.1zm-7.8 2.9c.7 0 1.4-.1 2.1-.4.7-.3 1.4-.7 1.9-1.3.3-.4.6-.8.7-1.3.1-.5.2-1.1.2-1.8v-.9c-.6-.1-1.2-.2-1.9-.3-.7-.1-1.3-.1-2-.1-1.3 0-2.3.3-2.9.8-.6.5-1 1.3-1 2.3 0 .9.2 1.6.7 2.1.5.6 1.2.9 2.2.9zm15.4 2c-.4 0-.7-.1-.8-.2-.2-.1-.3-.4-.4-.8l-4.6-15.2c-.1-.3-.2-.5-.2-.7 0-.3.1-.5.4-.5h2c.4 0 .7.1.8.2.2.1.3.4.4.8l3.3 13 3.1-13c.1-.4.2-.6.4-.8.2-.1.5-.2.9-.2h1.7c.4 0 .7.1.9.2.2.1.3.4.4.8l3.1 13.2 3.4-13.2c.1-.4.2-.6.4-.8.2-.1.5-.2.8-.2h1.9c.3 0 .5.2.5.5 0 .1 0 .2-.1.4 0 .1-.1.3-.2.5l-4.7 15.2c-.1.4-.2.6-.4.8-.2.1-.5.2-.8.2h-1.8c-.4 0-.7-.1-.9-.2-.2-.2-.3-.4-.4-.8l-3.1-12.7-3 12.6c-.1.4-.2.6-.4.8-.2.2-.5.2-.9.2h-1.8zm24.7.6c-1 0-2-.1-3-.4-.9-.3-1.7-.6-2.2-1-.3-.2-.5-.4-.6-.6-.1-.2-.1-.4-.1-.6v-1.1c0-.4.2-.7.5-.7.1 0 .3 0 .4.1.1.1.3.1.5.2.7.3 1.4.6 2.2.7.8.2 1.6.3 2.3.3 1.2 0 2.2-.2 2.8-.7.6-.4 1-1.1 1-1.9 0-.6-.2-1-.5-1.4-.4-.4-1-.7-1.9-1l-2.8-.9c-1.4-.4-2.4-1.1-3-2-.6-.8-.9-1.7-.9-2.7 0-.8.2-1.5.5-2.1.3-.6.8-1.2 1.3-1.6.6-.5 1.2-.8 2-1 .8-.2 1.6-.4 2.5-.4.4 0 .9 0 1.4.1.5.1.9.2 1.4.3.4.1.8.3 1.2.4.4.2.7.3.9.5.3.2.5.4.6.6.1.2.2.5.2.8v1c0 .4-.2.7-.5.7-.2 0-.5-.1-.8-.3-1.2-.5-2.5-.8-3.9-.8-1.1 0-2 .2-2.6.6-.6.4-.9 1-.9 1.8 0 .6.2 1.1.6 1.4.4.4 1.1.7 2.1 1.1l2.7.9c1.4.4 2.3 1.1 2.9 1.9.6.8.8 1.7.8 2.6 0 .8-.2 1.6-.5 2.2-.3.7-.8 1.2-1.4 1.7-.6.5-1.3.8-2.1 1.1-.9.3-1.8.4-2.8.4z"/>
  </svg>
);

// Linux/Server Logo SVG
const LinuxLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

interface StorageToggleProps {
  value: StorageType;
  onChange: (value: StorageType) => void;
}

const StorageToggle: React.FC<StorageToggleProps> = ({ value, onChange }) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: StorageType | null) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Storage / التخزين
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="storage type"
        sx={{
          '& .MuiToggleButton-root': {
            px: 3,
            py: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            },
          },
        }}
      >
        <ToggleButton value="aws" aria-label="AWS S3">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <Typography variant="body2" fontWeight={value === 'aws' ? 600 : 400}>
              AWS
            </Typography>
            {value === 'aws' && (
              <Box sx={{ mt: 0.5, color: 'primary.main', height: 20 }}>
                <AwsLogo />
              </Box>
            )}
          </Box>
        </ToggleButton>
        <ToggleButton value="vps" aria-label="VPS Local">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <Typography variant="body2" fontWeight={value === 'vps' ? 600 : 400}>
              Local
            </Typography>
            {value === 'vps' && (
              <Box sx={{ mt: 0.5, color: 'primary.main', height: 24 }}>
                <LinuxLogo />
              </Box>
            )}
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default StorageToggle;

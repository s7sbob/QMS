// src/layouts/full/vertical/header/ActionDD.tsx
import React, { useState } from 'react';
import { Box, Menu, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconChevronDown, IconHelp } from '@tabler/icons-react';
import ActionLinks from './ActionLinks';
import QuickLinks from './QuickLinks'; // إذا كان لديك QuickLinks، وإلا يمكنك إزالة هذا الجزء

const ActionDD: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <Button
          aria-label="show actions"
          color="inherit"
          variant="text"
          aria-controls="action-menu"
          aria-haspopup="true"
          sx={{
            bgcolor: anchorEl ? 'primary.light' : '',
            color: anchorEl ? 'primary.main' : (theme) => theme.palette.text.secondary,
          }}
          onClick={handleClick}
          endIcon={<IconChevronDown size="15" style={{ marginLeft: '-5px', marginTop: '2px' }} />}
        >
          Action
        </Button>
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '850px',
            },
            '& .MuiMenu-paper ul': {
              p: 0,
            },
          }}
        >
          <Grid container>
            <Grid item sm={8} display="flex">
              <Box p={4} pr={0} pb={3}>
                <ActionLinks />
                <Divider />
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'flex',
                    },
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  pr={4}
                >
                  <Link to="/faq" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color="textPrimary"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      <IconHelp width={24} />
                      Frequently Asked Questions
                    </Typography>
                  </Link>
                  <Button variant="contained" color="primary">
                    Check
                  </Button>
                </Box>
              </Box>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item sm={4}>
              <Box p={4}>
                <QuickLinks />
              </Box>
            </Grid>
          </Grid>
        </Menu>
      </Box>
      {/* الأزرار الجانبية كما في AppDD */}
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/apps/chats"
        component={Link}
      >
        Chat
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/apps/calendar"
        component={Link}
      >
        Calendar
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/apps/email"
        component={Link}
      >
        Email
      </Button>
    </>
  );
};

export default ActionDD;

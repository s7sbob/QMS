// src/layouts/full/vertical/header/ActionDD.tsx
import React, { useState } from 'react';
import { Box, Menu, Button,  Grid,  useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconChevronDown } from '@tabler/icons-react';
import ActionLinks from './ActionLinks';

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

// src/components/apps/users/UserAdd.tsx
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import UserAddDialog, { NewUserData } from './UserAddDialog';

const UserAdd: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (data: NewUserData) => {
    // هنا يمكنك ربط البيانات الجديدة مع Redux أو استدعاء API لإضافة المستخدم
    console.log("New User Data:", data);
  };

  return (
    <Box p={3}>
      <Button variant="contained" color="primary" startIcon={<IconPlus />} onClick={handleOpen}>
        Add New User
      </Button>
      <UserAddDialog open={open} onClose={handleClose} onSave={handleSave} />
    </Box>
  );
};

export default UserAdd;

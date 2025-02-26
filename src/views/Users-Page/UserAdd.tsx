// src/components/apps/users/UserAdd.tsx

import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import UserAddDialog from './UserAddDialog';
import { UserInput, addEditUserApi } from 'src/services/userService';

type UserAddProps = {
  onUserAdded: () => void; // عند الإضافة الناجحة، نخبر الأب لإعادة التحميل
};

const UserAdd: React.FC<UserAddProps> = ({ onUserAdded }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (data: UserInput) => {
    try {
      await addEditUserApi(data);
      handleClose();
      onUserAdded(); // إعادة تحميل القائمة في الأب
    } catch (error) {
      console.error('Error creating or editing user:', error);
      alert('Failed to create/update user!');
    }
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

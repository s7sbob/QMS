// src/components/apps/users/UserAdd.tsx

import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import UserAddDialog from './UserAddDialog';
import { UserInput, addEditUserApi } from 'src/services/userService';

type UserAddProps = {
  onUserAdded: () => void;
};

const UserAdd: React.FC<UserAddProps> = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (data: UserInput) => {
    try {
      const formData = new FormData();
      formData.append('FName', data.FName);
      formData.append('LName', data.LName);
      formData.append('Email', data.Email);
      formData.append('UserName', data.UserName);
      formData.append('Password', data.Password);
      if (data.signUrl) formData.append('signature', data.signUrl);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.is_Active !== undefined) formData.append('is_Active', data.is_Active.toString());

      // Append contacts if any
      if (data.contacts && data.contacts.length > 0) {
        data.contacts.forEach((contact, index) => {
          formData.append(`contacts[${index}][PhoneNumber]`, contact.PhoneNumber);
          formData.append(`contacts[${index}][address]`, contact.address);
        });
      }

      await addEditUserApi(formData);
      // Handle success: close dialog, refresh list, etc.
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

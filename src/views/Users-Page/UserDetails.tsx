// src/components/apps/users/UserDetails.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { IconPencil, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { IUser } from 'src/services/userService';

type UserDetailsProps = {
  user: IUser | null; // قد يكون null لو لم يتم اختيار مستخدم
};

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);

  useEffect(() => {
    // عند تغيير user في الـ props, نعيد ضبط editedUser
    setEditedUser(user);
    setEditMode(false);
  }, [user]);

  const handleEditToggle = () => {
    if (editMode && editedUser) {
      // هنا تحفظ التعديلات عبر API مثلاً
      console.log('User updated:', editedUser);
      // يمكنك استدعاء دالة updateUser(editedUser) من userService
    }
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    if (!user) return;
    console.log('User deleted:', user.Id);
    // استدعاء دالة حذف من API لو متوفر
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  if (!user) {
    return (
      <Box p={3} height="50vh" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4">Please Select a User</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box p={3} py={2} display="flex" alignItems="center">
        <Typography variant="h5">User Details</Typography>
        <Stack direction="row" gap={0} ml="auto">
          <Tooltip title={editMode ? 'Save' : 'Edit'}>
            <IconButton onClick={handleEditToggle}>
              {editMode ? (
                <IconDeviceFloppy size="18" stroke={1.3} />
              ) : (
                <IconPencil size="18" stroke={1.3} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <IconTrash size="18" stroke={1.3} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider />
      <Box p={3}>
        <Box display="flex" alignItems="center">
          <Avatar
            src={user.userImg_Url || ''}
            alt={`${user.FName} ${user.LName}`}
            sx={{ width: 72, height: 72 }}
          />
          <Box ml={2}>
            {editMode && editedUser ? (
              <Stack direction="row" spacing={2}>
                <TextField
                  name="FName"
                  label="First Name"
                  variant="standard"
                  value={editedUser.FName}
                  onChange={handleChange}
                />
                <TextField
                  name="LName"
                  label="Last Name"
                  variant="standard"
                  value={editedUser.LName}
                  onChange={handleChange}
                />
              </Stack>
            ) : (
              <>
                <Typography variant="h6">
                  {user.FName} {user.LName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.Email}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Username:
            </Typography>
            {editMode && editedUser ? (
              <TextField
                name="UserName"
                variant="standard"
                value={editedUser.UserName}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">{user.UserName}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth:
            </Typography>
            {editMode && editedUser ? (
              <TextField
                name="dateOfBirth"
                type="date"
                variant="standard"
                value={editedUser.dateOfBirth || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <Typography variant="body1">
                {user.dateOfBirth ? user.dateOfBirth : 'N/A'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserDetails;

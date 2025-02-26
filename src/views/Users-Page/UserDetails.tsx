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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { IconPencil, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { IUser, UserInput, addEditUserApi, deleteUser } from 'src/services/userService';

type UserDetailsProps = {
  user: IUser | null;
};

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);

  useEffect(() => {
    setEditedUser(user);
    setEditMode(false);
  }, [user]);

  const handleEditToggle = async () => {
    if (editMode && editedUser) {
      // عند حفظ التعديلات، نستخدم نفس الـ addEditUserApi (مع Id يعني تعديل)
      try {
        const userData: UserInput = {
          Id: editedUser.Id,
          FName: editedUser.FName,
          LName: editedUser.LName,
          Email: editedUser.Email,
          UserName: editedUser.UserName,
          Password: editedUser.Password || '',  // لو كانت فارغة
          userImg_Url: editedUser.userImg_Url || '',
          dateOfBirth: editedUser.dateOfBirth || '',
          is_Active: editedUser.is_Active,
          contacts: [], // لو عندك واجهة أخرى لجهات الاتصال
        };
        await addEditUserApi(userData);
        console.log('User updated successfully!');
      } catch (err) {
        console.error('Error updating user:', err);
        alert('Failed to update user');
      }
    }
    setEditMode(!editMode);
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.Id);
      alert('User soft-deleted successfully!');
      // يمكنك عمل إعادة تحميل للقائمة أو تصفير المستخدم المختار
      // setEditedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value, type, checked } = e.target;

    // لو الحقل is_Active
    if (name === 'is_Active' && type === 'checkbox') {
      setEditedUser({
        ...editedUser,
        is_Active: checked ? 1 : 0,
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value,
      });
    }
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
          <Box ml={2} flex={1}>
            {/* يمكن السماح بتعديل الاسم والصورة وغيرها */}
            <Stack direction="row" spacing={2}>
              {editMode && editedUser ? (
                <>
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
                </>
              ) : (
                <Box>
                  <Typography variant="h6">
                    {user.FName} {user.LName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.Email}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Username */}
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

          {/* Date of Birth */}
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

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Password:
            </Typography>
            {editMode && editedUser ? (
              <TextField
                name="Password"
                variant="standard"
                type="password"
                value={editedUser.Password}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">********</Typography>
            )}
          </Grid>

          {/* is_Active */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Active?
            </Typography>
            {editMode && editedUser ? (
              <FormControlLabel
                control={
                  <Switch
                    name="is_Active"
                    checked={editedUser.is_Active === 1}
                    onChange={handleChange}
                  />
                }
                label={editedUser.is_Active === 1 ? 'Active' : 'Inactive'}
              />
            ) : (
              <Typography variant="body1">
                {user.is_Active === 1 ? 'Yes' : 'No'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserDetails;

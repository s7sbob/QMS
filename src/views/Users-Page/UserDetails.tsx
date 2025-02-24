// src/components/apps/users/UserDetails.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Grid, 
  Divider, 
  IconButton, 
  Stack, 
  TextField 
} from '@mui/material';
import { IconPencil, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import sampleUsers, { User } from 'src/data/sampleUsers';

const UserDetails: React.FC = () => {
  // لمحاكاة اختيار المستخدم؛ في التطبيق الحقيقي يتم جلب المستخدم المحدد من Redux أو API
  const [user, setUser] = useState<User | null>(sampleUsers[0]);
  const [editMode, setEditMode] = useState(false);
  // عند بدء التحرير، نقوم بتهيئة editedUser ببيانات المستخدم الحالي (نستخدم ! لافتراض عدم وجود null)
  const [editedUser, setEditedUser] = useState<User>(user!);

  const handleEditToggle = () => {
    if (editMode) {
      // عند حفظ التعديلات، نقوم بتحديث بيانات المستخدم (يمكن ربطها بـ API لاحقًا)
      setUser(editedUser);
      console.log("User updated:", editedUser);
    }
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    // هنا يتم تنفيذ عملية الحذف (ربطها بـ API أو Redux لاحقًا)
    console.log("User deleted:", user?.id);
    setUser(null);
  };

  // تأكد من أن editedUser ليس null قبل التحديث
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    // إذا كانت الحقول التي نتعامل معها من النوع string فقط، فيمكن تحديثها مباشرة
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
      {/* Header with Edit and Delete Buttons */}
      <Box p={3} py={2} display="flex" alignItems="center">
        <Typography variant="h5">User Details</Typography>
        <Stack direction="row" gap={0} ml="auto">
          <Tooltip title={editMode ? 'Save' : 'Edit'}>
            <IconButton onClick={handleEditToggle}>
              { !editMode ? (
                <IconPencil size="18" stroke={1.3} />
              ) : (
                <IconDeviceFloppy size="18" stroke={1.3} />
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
      {/* User Information */}
      <Box p={3}>
        <Box display="flex" alignItems="center">
          <Avatar src={user.userImgUrl} alt={`${user.fName} ${user.lName}`} sx={{ width: 72, height: 72 }} />
          <Box ml={2}>
            {editMode ? (
              <Stack direction="row" spacing={2}>
                <TextField
                  name="fName"
                  label="First Name"
                  variant="standard"
                  value={editedUser.fName}
                  onChange={handleChange}
                />
                <TextField
                  name="lName"
                  label="Last Name"
                  variant="standard"
                  value={editedUser.lName}
                  onChange={handleChange}
                />
              </Stack>
            ) : (
              <>
                <Typography variant="h6">
                  {user.fName} {user.lName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
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
            {editMode ? (
              <TextField
                name="userName"
                variant="standard"
                value={editedUser.userName}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">{user.userName}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth:
            </Typography>
            {editMode ? (
              <TextField
                name="dateOfBirth"
                type="date"
                variant="standard"
                value={editedUser.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <Typography variant="body1">{user.dateOfBirth}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created Date:
            </Typography>
            <Typography variant="body1">{user.crtDate}</Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserDetails;

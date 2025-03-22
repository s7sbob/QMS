// src/components/apps/users/UserAddDialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { UserInput } from 'src/services/userService';

interface UserAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserInput) => void;
}

const UserAddDialog: React.FC<UserAddDialogProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserInput>({
    FName: '',
    LName: '',
    Email: '',
    UserName: '',
    Password: '',
    dateOfBirth: '',
    userImg_Url: '',
    signUrl: '',
    is_Active: 1, // افتراضيًا نفترض أنه 1 (فعال)
    contacts: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // لوكان الحقل Checkbox
    if (name === 'is_Active' && type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        is_Active: checked ? 1 : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    // إعادة ضبط الفورم (اختياري)
    setFormData({
      FName: '',
      LName: '',
      Email: '',
      UserName: '',
      Password: '',
      dateOfBirth: '',
      signUrl: '',
      userImg_Url: '',
      is_Active: 1,
      contacts: [],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="FName"
              value={formData.FName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="LName"
              value={formData.LName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="Password"
              type="password"
              value={formData.Password}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="userImg_Url"
              value={formData.userImg_Url}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="is_Active"
                  checked={formData.is_Active === 1}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Is Active?"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAddDialog;

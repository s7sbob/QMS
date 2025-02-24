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
} from '@mui/material';

export interface NewUserData {
  fName: string;
  lName: string;
  dateOfBirth: string;
  userName: string;
  password: string;
  email: string;
  userImgUrl?: string;
}

interface UserAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewUserData) => void;
}

const UserAddDialog: React.FC<UserAddDialogProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewUserData>({
    fName: '',
    lName: '',
    dateOfBirth: '',
    userName: '',
    password: '',
    email: '',
    userImgUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // هنا يمكن إضافة التحقق من صحة البيانات قبل الحفظ
    onSave(formData);
    // إعادة تعيين النموذج بعد الحفظ (اختياري)
    setFormData({
      fName: '',
      lName: '',
      dateOfBirth: '',
      userName: '',
      password: '',
      email: '',
      userImgUrl: '',
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
              name="fName"
              value={formData.fName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lName"
              value={formData.lName}
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
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="userImgUrl"
              value={formData.userImgUrl}
              onChange={handleChange}
              variant="outlined"
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

/* eslint-disable @typescript-eslint/no-unused-vars */
// src/layouts/full/vertical/auth/AuthRegister.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { addEditUserApi } from 'src/services/userService';
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

interface AuthRegisterProps {
  subtext?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const AuthRegister: React.FC<AuthRegisterProps> = () => {
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    dateOfBirth: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userImgUrl: '',
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // التحكم في رفع الملف + عرض المعاينة
  const [previewImg, setPreviewImg] = useState<string>(''); // لعرض معاينة الصورة
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          userImgUrl: base64Str,
        }));
        setPreviewImg(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, and a symbol.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // إنشاء كائن اليوزر الذي سنرسله للـ API
        const userToCreate = {
          Id: '',
          FName: formData.fName,
          LName: formData.lName,
          Email: formData.email,
          UserName: formData.userName,
          Password: formData.password,
          userImg_Url: formData.userImgUrl, 
          dateOfBirth: formData.dateOfBirth,
          contacts: [
            {
              PhoneNumber: '',
              address: '',
            },
          ],
        };

        const response = await addEditUserApi(userToCreate);
        console.log('User created:', response);
        navigate('/auth/login2');
      } catch (error) {
        console.error('Registration error:', error);
        alert('حدث خطأ أثناء تسجيل الحساب');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Stack spacing={2}>
        <TextField
          required
          label="First Name"
          name="fName"
          value={formData.fName}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          required
          label="Last Name"
          name="lName"
          value={formData.lName}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />

        {/* Date of Birth عبر Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date of Birth"
            inputFormat="YYYY-MM-DD"
            value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                dateOfBirth: newValue
                  ? newValue.format('YYYY-MM-DD')
                  : '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
              />
            )}
          />
        </LocalizationProvider>

        <TextField
          required
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          required
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          required
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          required
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        {/* حقل رفع ملف للصورة + معاينة */}
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Upload Profile Image (optional)
          </Typography>
          <Button variant="outlined" component="label">
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {/* معاينة الصورة */}
          {previewImg && (
            <Box mt={2}>
              <Typography variant="subtitle2">Preview:</Typography>
              <img
                src={previewImg}
                alt="Preview"
                style={{
                  maxWidth: '100px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}
              />
            </Box>
          )}
        </Box>

      </Stack>
      <Box mt={3}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          fullWidth
        >
          Sign Up
        </Button>
      </Box>
      <Stack direction="row" spacing={1} mt={2} justifyContent="center">
        <Typography variant="subtitle1" color="textSecondary">
          Already have an Account?
        </Typography>
        <Typography
          component={Link}
          to="/auth/login"
          variant="subtitle1"
          fontWeight="500"
          sx={{ textDecoration: 'none', color: 'primary.main' }}
        >
          Sign In
        </Typography>
      </Stack>
    </Box>
  );
};

export default AuthRegister;

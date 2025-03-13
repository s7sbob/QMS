// src/layouts/full/vertical/auth/authForms/AuthRegister.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { addEditUserApi } from 'src/services/userService';
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// أيقونات العين
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

const AuthRegister: React.FC = () => {
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

  const [previewImg, setPreviewImg] = useState<string>(''); // لمعاينة الصورة
  const navigate = useNavigate();

  // لرؤية/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    // تحقق من كلمة المرور
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

        // عند نجاح التسجيل، الانتقال لصفحة تسجيل الدخول
        navigate('/auth/login2');
      } catch (error) {
        console.error('Registration error:', error);
        alert('حدث خطأ أثناء تسجيل الحساب');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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
                dateOfBirth: newValue ? newValue.format('YYYY-MM-DD') : '',
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

        {/* حقل Password مع إظهار/إخفاء عبر أيقونة العين */}
        <TextField
          required
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* حقل Confirm Password مع إظهار/إخفاء عبر الأيقونة */}
        <TextField
          required
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPass ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  edge="end"
                >
                  {showConfirmPass ? <IconEyeOff /> : <IconEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          to="/auth/login2"
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

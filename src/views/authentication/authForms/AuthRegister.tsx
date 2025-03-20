// src/layouts/full/vertical/auth/authForms/AuthRegister.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { addEditUserApi } from 'src/services/userService';
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
    // سنتعامل مع الملفات كـ File objects
    profileImage: null as File | null,
    signature: null as File | null,
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [previewImg, setPreviewImg] = useState<string>(''); // لمعاينة الصورة الشخصية
  const [previewSignature, setPreviewSignature] = useState<string>(''); // لمعاينة التوقيع
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // رفع الصورة الشخصية
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // رفع التوقيع
  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, signature: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSignature(reader.result as string);
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
        const formDataToSend = new FormData();
        formDataToSend.append('FName', formData.fName);
        formDataToSend.append('LName', formData.lName);
        formDataToSend.append('Email', formData.email);
        formDataToSend.append('UserName', formData.userName);
        formDataToSend.append('Password', formData.password);
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
        // رفع الملفات باستخدام الأسماء المتوقعة من الباكند
        if (formData.profileImage) {
          formDataToSend.append('userImg', formData.profileImage);
        }
        if (formData.signature) {
          formDataToSend.append('signature', formData.signature);
        }

        const response = await addEditUserApi(formDataToSend);
        console.log('User created:', response);
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
            renderInput={(params) => <TextField {...params} required fullWidth />}
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

        {/* رفع الصورة الشخصية */}
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Upload Profile Image (optional)
          </Typography>
          <Button variant="outlined" component="label">
            Select Profile Image
            <input type="file" hidden onChange={handleProfileImageChange} />
          </Button>
          {previewImg && (
            <Box mt={2}>
              <Typography variant="subtitle2">Profile Image Preview:</Typography>
              <img
                src={previewImg}
                alt="Profile Preview"
                style={{
                  maxWidth: '100px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '8px',
                }}
              />
            </Box>
          )}
        </Box>

        {/* رفع التوقيع */}
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Upload Signature (optional)
          </Typography>
          <Button variant="outlined" component="label">
            Select Signature
            <input type="file" hidden onChange={handleSignatureChange} />
          </Button>
          {previewSignature && (
            <Box mt={2}>
              <Typography variant="subtitle2">Signature Preview:</Typography>
              <img
                src={previewSignature}
                alt="Signature Preview"
                style={{
                  maxWidth: '100px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '8px',
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

// src/layouts/full/vertical/auth/AuthRegister.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      // هنا يتم إرسال البيانات إلى الـ API الخاص بالتسجيل
      console.log('Registering user:', formData);
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
        <TextField
          required
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
        />
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
        <TextField
          label="Image URL (optional)"
          name="userImgUrl"
          value={formData.userImgUrl}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
      </Stack>
      <Box mt={3}>
        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
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

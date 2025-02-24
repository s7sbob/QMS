// src/layouts/full/vertical/auth/AuthLogin.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';

const AuthLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // هنا يمكنك ربط بيانات الدخول بـ API للتحقق
    console.log("Login data:", { username, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField 
          required 
          label="Username" 
          variant="outlined" 
          fullWidth 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <TextField 
          required 
          label="Password" 
          type="password" 
          variant="outlined" 
          fullWidth 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember this Device" />
          </FormGroup>
          <Typography 
            component={Link} 
            to="/auth/forgot-password" 
            sx={{ textDecoration: 'none', color: 'primary.main' }}
          >
            Forgot Password?
          </Typography>
        </Stack>
      </Stack>
      <Box mt={3}>
        <Button 
          type="submit" 
          color="primary" 
          variant="contained" 
          size="large" 
          fullWidth
        >
          Sign In
        </Button>
      </Box>
      <Stack direction="row" spacing={1} mt={3} justifyContent="center">
        <Typography variant="subtitle1" color="textSecondary">
          New to Modernize?
        </Typography>
        <Typography 
          component={Link}
          to="/auth/register"
          variant="subtitle1"
          fontWeight="500"
          sx={{ textDecoration: 'none', color: 'primary.main' }}
        >
          Create an account
        </Typography>
      </Stack>
    </Box>
  );
};

export default AuthLogin;

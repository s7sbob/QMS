import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from 'src/services/authService';
import Cookies from 'js-cookie';

const AuthLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginApi({ UserName: username, Password: password });
      console.log('Login success:', response);

      // تخزين التوكن في الكوكيز
      // يمكنك إضافة خيارات مثل مدة الانتهاء (expires) أو secure أو غيرها
      Cookies.set('token', response.token, { expires: 7 }); // تخزين لمدة 7 أيام كمثال

      // توجيه للداشبورد أو أي صفحة أخرى
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
    }
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
        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default AuthLogin;

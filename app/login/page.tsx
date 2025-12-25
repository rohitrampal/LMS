'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, initializeDummyData } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initializeDummyData();
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, initializeDummyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Loan Management System
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              href="/signup"
              variant="body2"
              sx={{ mr: 2 }}
            >
              Don't have an account? Sign Up
            </Link>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom fontWeight="bold">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              Super Admin: superadmin@yopmail.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Admin: admin@yopmail.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Bank Admin: bankadmin@yopmail.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Bank Employee: bankemployee@yopmail.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Regulator: regulator@yopmail.com / admin123
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}



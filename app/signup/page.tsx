'use client';

import React, { useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';
import type { UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { addUser, getUserByEmail, banks } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('bank_employee');
  const [bankId, setBankId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (getUserByEmail(email)) {
      setError('Email already exists');
      return;
    }

    const bank = bankId ? banks.find(b => b.id === bankId) : undefined;

    const newUser = {
      id: generateId(),
      email,
      password,
      name,
      role,
      bankId: bank?.id,
      bankName: bank?.name,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    // Send email with credentials
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login-credentials',
          to: email,
          name,
          email,
          password,
          role,
        }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created successfully! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="bank_employee">Bank Employee</MenuItem>
              <MenuItem value="bank">Bank Admin</MenuItem>
            </Select>
          </FormControl>
          {(role === 'bank' || role === 'bank_employee') && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Bank</InputLabel>
              <Select
                value={bankId}
                label="Bank"
                onChange={(e) => setBankId(e.target.value)}
                required
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}



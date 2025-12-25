'use client';

import React from 'react';
import { Container, Paper, Typography, Box, Grid, Chip } from '@mui/material';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  const getRoleDisplay = () => {
    if (currentUser.role === 'bank') {
      return `${currentUser.role.toUpperCase()} - ${currentUser.bankName || ''}`;
    }
    if (currentUser.role === 'bank_employee') {
      return `${currentUser.roleText || 'Employee'} - ${currentUser.bankName || ''}`;
    }
    return currentUser.role.toUpperCase();
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Profile
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Name
            </Typography>
            <Typography variant="h6" gutterBottom>
              {currentUser.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="h6" gutterBottom>
              {currentUser.email}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Role
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label={getRoleDisplay()} color="primary" />
            </Box>
          </Grid>

          {currentUser.bankName && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Bank
              </Typography>
              <Typography variant="h6" gutterBottom>
                {currentUser.bankName}
              </Typography>
            </Grid>
          )}

          {currentUser.roleText && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Position
              </Typography>
              <Typography variant="h6" gutterBottom>
                {currentUser.roleText}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Account Status
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={currentUser.isActive ? 'Active' : 'Inactive'}
                color={currentUser.isActive ? 'success' : 'default'}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}



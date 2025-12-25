'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function Navbar() {
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    handleClose();
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

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
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Loan Management System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={getRoleDisplay()}
            color="primary"
            size="small"
            sx={{ color: 'white' }}
          />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>
              <PersonIcon sx={{ mr: 1 }} fontSize="small" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';

export default function AdminsPage() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useStore();
  const [open, setOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'admin123',
    isActive: true,
  });
  const [error, setError] = useState('');

  const admins = users.filter((u) => u.role === 'admin');

  const canEdit = currentUser?.role === 'superadmin';

  const handleOpen = (admin?: any) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        password: admin.password || 'admin123',
        isActive: admin.isActive,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        name: '',
        email: '',
        password: 'admin123',
        isActive: true,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAdmin(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (editingAdmin) {
      updateUser(editingAdmin.id, formData);
    } else {
      const newAdmin = {
        id: generateId(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'admin' as const,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      };
      addUser(newAdmin);
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'login-credentials',
            to: formData.email,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'admin',
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      deleteUser(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Admins
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add Admin
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.isActive ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(admin)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(admin.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          {!editingAdmin && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



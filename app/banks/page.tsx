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
  Switch,
  FormControlLabel,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';

export default function BanksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { banks, currentUser, addBank, updateBank, deleteBank, addUser } = useStore();
  const [open, setOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    registrationNumber: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

  const handleOpen = (bank?: any) => {
    if (bank) {
      setEditingBank(bank);
      setFormData({
        name: bank.name,
        email: bank.email,
        address: bank.address,
        phone: bank.phone,
        registrationNumber: bank.registrationNumber,
        isActive: bank.isActive,
      });
    } else {
      setEditingBank(null);
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        registrationNumber: '',
        isActive: true,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBank(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.registrationNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (editingBank) {
      updateBank(editingBank.id, formData);
    } else {
      const newBank = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addBank(newBank);

      // Create bank user and send credentials
      const bankUser = {
        id: generateId(),
        email: formData.email,
        password: 'admin123',
        name: formData.name,
        role: 'bank' as const,
        bankId: newBank.id,
        bankName: formData.name,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addUser(bankUser);
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'login-credentials',
            to: formData.email,
            name: formData.name,
            email: formData.email,
            password: 'admin123',
            role: 'bank',
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bank?')) {
      deleteBank(id);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Banks
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Bank
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell>{bank.name}</TableCell>
                <TableCell>{bank.email}</TableCell>
                <TableCell>{bank.phone}</TableCell>
                <TableCell>{bank.registrationNumber}</TableCell>
                <TableCell>{bank.address}</TableCell>
                <TableCell>
                  {bank.isActive ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(bank)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(bank.id)} size="small" color="error">
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
        <DialogTitle>{editingBank ? 'Edit Bank' : 'Add Bank'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Bank Name"
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
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
          />
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
            {editingBank ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



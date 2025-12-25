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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';

export default function RegulatorsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { regulators, currentUser, addRegulator, updateRegulator, deleteRegulator, addUser } = useStore();
  const [open, setOpen] = useState(false);
  const [editingRegulator, setEditingRegulator] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'admin123',
    organization: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

  const handleOpen = (regulator?: any) => {
    if (regulator) {
      setEditingRegulator(regulator);
      setFormData({
        name: regulator.name,
        email: regulator.email,
        password: regulator.password || 'admin123',
        organization: regulator.organization,
        isActive: regulator.isActive,
      });
    } else {
      setEditingRegulator(null);
      setFormData({
        name: '',
        email: '',
        password: 'admin123',
        organization: '',
        isActive: true,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRegulator(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.organization) {
      setError('Please fill in all required fields');
      return;
    }

    if (editingRegulator) {
      updateRegulator(editingRegulator.id, formData);
    } else {
      const newRegulator = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addRegulator(newRegulator);

      // Create user
      const regulatorUser = {
        id: generateId(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'regulator' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addUser(regulatorUser);
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
            role: 'regulator',
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this regulator?')) {
      deleteRegulator(id);
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
        mb: { xs: 2, sm: 3 } 
      }}>
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Regulators
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 150 } }}
          >
            Add Regulator
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 500,
          },
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Status</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {regulators.map((regulator) => (
              <TableRow key={regulator.id}>
                <TableCell>{regulator.name}</TableCell>
                <TableCell>{regulator.email}</TableCell>
                <TableCell>{regulator.organization}</TableCell>
                <TableCell>
                  {regulator.isActive ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(regulator)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(regulator.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
          },
        }}
      >
        <DialogTitle>{editingRegulator ? 'Edit Regulator' : 'Add Regulator'}</DialogTitle>
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
          <TextField
            fullWidth
            label="Organization"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            margin="normal"
            required
          />
          {!editingRegulator && (
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
            {editingRegulator ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



'use client';

import React, { useState, useMemo } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';

const PERMISSIONS = [
  'loan_applications',
  'loan_disbursements',
  'loan_adjustments',
  'accounts',
  'loan_categories',
  'loan_products',
];

export default function BankEmployeesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { bankEmployees, currentUser, banks, addBankEmployee, updateBankEmployee, deleteBankEmployee, addUser } = useStore();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'admin123',
    bankId: '',
    role: '',
    permissions: [] as string[],
    isActive: true,
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId || currentUser?.role === 'superadmin' || currentUser?.role === 'admin' ? '' : currentUser?.bankId;

  const filteredEmployees = useMemo(() => {
    if (currentUser?.role === 'bank') {
      return bankEmployees.filter((emp) => emp.bankId === currentUser.bankId);
    }
    return bankEmployees;
  }, [bankEmployees, currentUser]);

  const availableBanks = useMemo(() => {
    if (currentUser?.role === 'bank') {
      return banks.filter((b) => b.id === currentUser.bankId);
    }
    return banks;
  }, [banks, currentUser]);

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'admin' || currentUser?.role === 'bank';

  const handleOpen = (employee?: any) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        password: employee.password || 'admin123',
        bankId: employee.bankId,
        role: employee.role,
        permissions: employee.permissions || [],
        isActive: employee.isActive,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        password: 'admin123',
        bankId: currentUser?.bankId || '',
        role: '',
        permissions: [],
        isActive: true,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEmployee(null);
    setError('');
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter((p) => p !== permission)
        : [...formData.permissions, permission],
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.bankId) {
      setError('Please fill in all required fields');
      return;
    }

    const bank = banks.find((b) => b.id === formData.bankId);

    if (editingEmployee) {
      updateBankEmployee(editingEmployee.id, {
        ...formData,
        bankName: bank?.name,
      });
    } else {
      const newEmployee = {
        id: generateId(),
        ...formData,
        bankName: bank?.name || '',
        createdAt: new Date().toISOString(),
      };
      addBankEmployee(newEmployee);

      // Create user and send credentials
      const employeeUser = {
        id: generateId(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'bank_employee' as const,
        bankId: formData.bankId,
        bankName: bank?.name,
        roleText: formData.role,
        permissions: formData.permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addUser(employeeUser);
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
            role: 'bank_employee',
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteBankEmployee(id);
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
          Bank Employees
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 150 } }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 800,
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
              <TableCell>Bank</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Status</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.bankName}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {employee.permissions.slice(0, 2).map((p) => (
                    <Chip key={p} label={p} size="small" sx={{ mr: 0.5 }} />
                  ))}
                  {employee.permissions.length > 2 && `+${employee.permissions.length - 2}`}
                </TableCell>
                <TableCell>
                  {employee.isActive ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(employee)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(employee.id)} size="small" color="error">
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
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
          },
        }}
      >
        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Bank</InputLabel>
            <Select
              value={formData.bankId}
              label="Bank"
              onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
            >
              {availableBanks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Role (e.g., Manager, Accountant)"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
          />
          {!editingEmployee && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
            />
          )}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Permissions
            </Typography>
            {PERMISSIONS.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Switch
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                  />
                }
                label={permission.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              />
            ))}
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId, formatCurrency } from '@/utils/helpers';

export default function AccountsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accounts, currentUser, banks, addAccount, updateAccount, deleteAccount } = useStore();
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [formData, setFormData] = useState({
    borrowerName: '',
    accountNumber: '',
    bankId: '',
    email: '',
    phone: '',
    address: '',
    balance: 0,
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId;

  const filteredAccounts = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return accounts.filter((acc) => acc.bankId === bankId);
    }
    return accounts;
  }, [accounts, currentUser, bankId]);

  const availableBanks = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return banks.filter((b) => b.id === bankId);
    }
    return banks;
  }, [banks, currentUser, bankId]);

  const canEdit = currentUser?.role === 'superadmin' || 
                  currentUser?.role === 'admin' || 
                  currentUser?.role === 'bank' || 
                  currentUser?.role === 'bank_employee';

  const handleOpen = (account?: any) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        borrowerName: account.borrowerName,
        accountNumber: account.accountNumber,
        bankId: account.bankId,
        email: account.email,
        phone: account.phone,
        address: account.address,
        balance: account.balance,
      });
    } else {
      setEditingAccount(null);
      setFormData({
        borrowerName: '',
        accountNumber: generateId().substring(0, 12),
        bankId: bankId || '',
        email: '',
        phone: '',
        address: '',
        balance: 0,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.borrowerName || !formData.accountNumber || !formData.bankId) {
      setError('Please fill in all required fields');
      return;
    }

    const bank = banks.find((b) => b.id === formData.bankId);

    if (editingAccount) {
      updateAccount(editingAccount.id, {
        ...formData,
        bankName: bank?.name,
      });
    } else {
      addAccount({
        id: generateId(),
        ...formData,
        bankName: bank?.name || '',
        createdAt: new Date().toISOString(),
      });
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id);
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
          Accounts
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 140 } }}
          >
            Add Account
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 650,
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
              <TableCell>Account Number</TableCell>
              <TableCell>Borrower Name</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Balance</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.borrowerName}</TableCell>
                <TableCell>{account.bankName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.phone}</TableCell>
                <TableCell>{formatCurrency(account.balance)}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(account)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(account.id)} size="small" color="error">
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
        <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Borrower Name"
            value={formData.borrowerName}
            onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Account Number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
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
            label="Address"
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Balance"
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAccount ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



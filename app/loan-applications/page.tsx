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
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId, generateApplicationNumber, formatCurrency, formatDate } from '@/utils/helpers';
import type { LoanStatus } from '@/types';

export default function LoanApplicationsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    loanApplications,
    accounts,
    loanProducts,
    currentUser,
    addLoanApplication,
    updateLoanApplication,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [formData, setFormData] = useState({
    accountId: '',
    loanProductId: '',
    amount: 0,
    remarks: '',
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId;

  const filteredApplications = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanApplications.filter((app) => app.bankId === bankId);
    }
    return loanApplications;
  }, [loanApplications, currentUser, bankId]);

  const availableAccounts = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return accounts.filter((acc) => acc.bankId === bankId);
    }
    return accounts;
  }, [accounts, currentUser, bankId]);

  const availableProducts = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanProducts.filter((prod) => !prod.bankId || prod.bankId === bankId);
    }
    return loanProducts;
  }, [loanProducts, currentUser, bankId]);

  const canEdit = currentUser?.role === 'superadmin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'bank' ||
    currentUser?.role === 'bank_employee';

  const canApprove = canEdit;

  const handleOpen = (application?: any) => {
    if (application) {
      setSelectedApplication(application);
      setFormData({
        accountId: application.accountId,
        loanProductId: application.loanProductId,
        amount: application.amount,
        remarks: application.remarks || '',
      });
    } else {
      setSelectedApplication(null);
      setFormData({
        accountId: '',
        loanProductId: '',
        amount: 0,
        remarks: '',
      });
    }
    setError('');
    setOpen(true);
  };

  const handleView = (application: any) => {
    setSelectedApplication(application);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedApplication(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.accountId || !formData.loanProductId || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    const account = accounts.find((acc) => acc.id === formData.accountId);
    const product = loanProducts.find((prod) => prod.id === formData.loanProductId);

    if (!account || !product) {
      setError('Invalid account or product selected');
      return;
    }

    if (selectedApplication) {
      updateLoanApplication(selectedApplication.id, {
        amount: formData.amount,
        remarks: formData.remarks,
      });
    } else {
      addLoanApplication({
        id: generateId(),
        applicationNumber: generateApplicationNumber('APP'),
        accountId: formData.accountId,
        borrowerName: account.borrowerName,
        accountNumber: account.accountNumber,
        loanProductId: formData.loanProductId,
        loanProductName: product.name,
        loanCategoryId: product.loanCategoryId,
        loanCategoryName: product.loanCategoryName,
        amount: formData.amount,
        interestRate: product.interestRate,
        tenureMonths: product.tenureMonths,
        status: 'pending',
        bankId: bankId || account.bankId,
        bankName: account.bankName,
        appliedBy: currentUser?.id || '',
        appliedAt: new Date().toISOString(),
        remarks: formData.remarks,
      });
    }

    handleClose();
  };

  const handleStatusChange = (id: string, status: LoanStatus) => {
    updateLoanApplication(id, {
      status,
      approvedBy: status === 'approved' ? currentUser?.id : undefined,
      approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
    });
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'disbursed':
        return 'info';
      case 'active':
        return 'primary';
      case 'closed':
        return 'default';
      default:
        return 'default';
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
            wordBreak: 'break-word',
          }}
        >
          Loan Applications
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 160 } }}
          >
            New Application
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
              <TableCell>Application #</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.applicationNumber}</TableCell>
                <TableCell>{application.borrowerName}</TableCell>
                <TableCell>{application.loanProductName}</TableCell>
                <TableCell>{formatCurrency(application.amount)}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status.toUpperCase()}
                    color={getStatusColor(application.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(application.appliedAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(application)} size="small">
                    <Visibility />
                  </IconButton>
                  {canApprove && application.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(application.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
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
        <DialogTitle>{selectedApplication ? 'Edit Application' : 'New Application'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Account</InputLabel>
            <Select
              value={formData.accountId}
              label="Account"
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            >
              {availableAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.borrowerName} - {account.accountNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Loan Product</InputLabel>
            <Select
              value={formData.loanProductId}
              label="Loan Product"
              onChange={(e) => setFormData({ ...formData, loanProductId: e.target.value })}
            >
              {availableProducts.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - {product.interestRate}% - {formatCurrency(product.minAmount)} to {formatCurrency(product.maxAmount)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Loan Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Remarks"
            multiline
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedApplication ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={viewOpen} 
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
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Application Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedApplication.applicationNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Borrower
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedApplication.borrowerName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Loan Product
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedApplication.loanProductName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatCurrency(selectedApplication.amount)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Interest Rate
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedApplication.interestRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Tenure
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedApplication.tenureMonths} months
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Status
              </Typography>
              <Chip
                label={selectedApplication.status.toUpperCase()}
                color={getStatusColor(selectedApplication.status) as any}
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



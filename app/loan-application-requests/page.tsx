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
} from '@mui/material';
import { Add, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId, generateApplicationNumber, formatCurrency, formatDate } from '@/utils/helpers';

export default function LoanApplicationRequestsPage() {
  const {
    loanApplicationRequests,
    accounts,
    loanProducts,
    currentUser,
    addLoanApplicationRequest,
    updateLoanApplicationRequest,
    loanApplications,
    addLoanApplication,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    accountId: '',
    loanProductId: '',
    amount: 0,
    remarks: '',
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId;

  const filteredRequests = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanApplicationRequests.filter((req) => req.bankId === bankId);
    }
    return loanApplicationRequests;
  }, [loanApplicationRequests, currentUser, bankId]);

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

  const canApprove = canEdit && (currentUser?.role === 'bank' || currentUser?.roleText === 'Head Manager');

  const handleOpen = () => {
    setSelectedRequest(null);
    setFormData({
      accountId: '',
      loanProductId: '',
      amount: 0,
      remarks: '',
    });
    setError('');
    setOpen(true);
  };

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedRequest(null);
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

    addLoanApplicationRequest({
      id: generateId(),
      requestNumber: generateApplicationNumber('REQ'),
      accountId: formData.accountId,
      borrowerName: account.borrowerName,
      accountNumber: account.accountNumber,
      loanProductId: formData.loanProductId,
      loanProductName: product.name,
      amount: formData.amount,
      status: 'pending',
      bankId: bankId || account.bankId,
      bankName: account.bankName,
      requestedBy: currentUser?.id || '',
      requestedAt: new Date().toISOString(),
      remarks: formData.remarks,
    });

    handleClose();
  };

  const handleApprove = (request: any) => {
    const account = accounts.find((acc) => acc.id === request.accountId);
    const product = loanProducts.find((prod) => prod.id === request.loanProductId);

    if (!account || !product) return;

    // Update request status
    updateLoanApplicationRequest(request.id, {
      status: 'approved',
      reviewedBy: currentUser?.id,
      reviewedAt: new Date().toISOString(),
    });

    // Create loan application from approved request
    addLoanApplication({
      id: generateId(),
      applicationNumber: generateApplicationNumber('APP'),
      accountId: request.accountId,
      borrowerName: request.borrowerName,
      accountNumber: request.accountNumber,
      loanProductId: request.loanProductId,
      loanProductName: product.name,
      loanCategoryId: product.loanCategoryId,
      loanCategoryName: product.loanCategoryName,
      amount: request.amount,
      interestRate: product.interestRate,
      tenureMonths: product.tenureMonths,
      status: 'approved',
      bankId: request.bankId,
      bankName: request.bankName,
      appliedBy: request.requestedBy,
      approvedBy: currentUser?.id,
      appliedAt: request.requestedAt,
      approvedAt: new Date().toISOString(),
      remarks: request.remarks,
    });
  };

  const handleReject = (id: string) => {
    updateLoanApplicationRequest(id, {
      status: 'rejected',
      reviewedBy: currentUser?.id,
      reviewedAt: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Loan Application Requests
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
          >
            New Request
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request #</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.requestNumber}</TableCell>
                <TableCell>{request.borrowerName}</TableCell>
                <TableCell>{request.loanProductName}</TableCell>
                <TableCell>{formatCurrency(request.amount)}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status.toUpperCase()}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(request.requestedAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(request)} size="small">
                    <Visibility />
                  </IconButton>
                  {canApprove && request.status === 'pending' && (
                    <>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleApprove(request)}
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleReject(request.id)}
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Request</DialogTitle>
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
                  {product.name} - {product.interestRate}%
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
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Request Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRequest.requestNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Borrower
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRequest.borrowerName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatCurrency(selectedRequest.amount)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Status
              </Typography>
              <Chip
                label={selectedRequest.status.toUpperCase()}
                color={getStatusColor(selectedRequest.status) as any}
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



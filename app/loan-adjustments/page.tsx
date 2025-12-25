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
import { Add, Visibility } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId, generateApplicationNumber, formatCurrency, formatDate } from '@/utils/helpers';

const ADJUSTMENT_TYPES = [
  { value: 'penalty_waiver', label: 'Penalty Waiver' },
  { value: 'overpayment', label: 'Overpayment' },
  { value: 'partial_settlement', label: 'Partial Settlement' },
  { value: 'interest_recalculation', label: 'Interest Recalculation' },
  { value: 'early_closure', label: 'Early Closure' },
];

export default function LoanAdjustmentsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    loanAdjustments,
    loanApplications,
    currentUser,
    addLoanAdjustment,
    updateLoanApplication,
    updateAccount,
    accounts,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<any>(null);
  const [formData, setFormData] = useState({
    loanApplicationId: '',
    adjustmentType: '',
    amount: 0,
    reason: '',
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId;

  const filteredAdjustments = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanAdjustments.filter((adj) => adj.bankId === bankId);
    }
    return loanAdjustments;
  }, [loanAdjustments, currentUser, bankId]);

  const activeLoans = useMemo(() => {
    let apps = loanApplications.filter(
      (app) => app.status === 'active' || app.status === 'disbursed'
    );
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      apps = apps.filter((app) => app.bankId === bankId);
    }
    return apps;
  }, [loanApplications, currentUser, bankId]);

  const canEdit = currentUser?.role === 'superadmin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'bank' ||
    currentUser?.role === 'bank_employee';

  const handleOpen = () => {
    setSelectedAdjustment(null);
    setFormData({
      loanApplicationId: '',
      adjustmentType: '',
      amount: 0,
      reason: '',
    });
    setError('');
    setOpen(true);
  };

  const handleView = (adjustment: any) => {
    setSelectedAdjustment(adjustment);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedAdjustment(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.loanApplicationId || !formData.adjustmentType || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    const application = loanApplications.find((app) => app.id === formData.loanApplicationId);

    if (!application) {
      setError('Invalid loan application');
      return;
    }

    const newAdjustment = {
      id: generateId(),
      adjustmentNumber: generateApplicationNumber('ADJ'),
      loanApplicationId: application.id,
      accountId: application.accountId,
      borrowerName: application.borrowerName,
      adjustmentType: formData.adjustmentType as any,
      amount: formData.amount,
      reason: formData.reason,
      approvedBy: currentUser?.id || '',
      bankId: application.bankId,
      bankName: application.bankName,
      adjustedAt: new Date().toISOString(),
    };

    addLoanAdjustment(newAdjustment);

    // Update account balance based on adjustment type
    const account = accounts.find((acc) => acc.id === application.accountId);
    if (account) {
      let newBalance = account.balance;
      if (formData.adjustmentType === 'overpayment' || formData.adjustmentType === 'early_closure') {
        newBalance -= formData.amount; // Reduce balance
      } else if (formData.adjustmentType === 'penalty_waiver') {
        // No balance change for waiver
      } else if (formData.adjustmentType === 'partial_settlement') {
        newBalance -= formData.amount;
      }

      updateAccount(account.id, { balance: newBalance });
    }

    // Update loan status if early closure
    if (formData.adjustmentType === 'early_closure') {
      updateLoanApplication(application.id, { status: 'closed' });
    }

    handleClose();
  };

  const getAdjustmentTypeLabel = (type: string) => {
    return ADJUSTMENT_TYPES.find((t) => t.value === type)?.label || type;
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
          Loan Adjustments
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 160 } }}
          >
            New Adjustment
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 700,
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
              <TableCell>Adjustment #</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdjustments.map((adjustment) => (
              <TableRow key={adjustment.id}>
                <TableCell>{adjustment.adjustmentNumber}</TableCell>
                <TableCell>{adjustment.borrowerName}</TableCell>
                <TableCell>{getAdjustmentTypeLabel(adjustment.adjustmentType)}</TableCell>
                <TableCell>{formatCurrency(adjustment.amount)}</TableCell>
                <TableCell>{adjustment.reason}</TableCell>
                <TableCell>{formatDate(adjustment.adjustedAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(adjustment)} size="small">
                    <Visibility />
                  </IconButton>
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
        <DialogTitle>New Adjustment</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Loan Application</InputLabel>
            <Select
              value={formData.loanApplicationId}
              label="Loan Application"
              onChange={(e) => setFormData({ ...formData, loanApplicationId: e.target.value })}
            >
              {activeLoans.map((app) => (
                <MenuItem key={app.id} value={app.id}>
                  {app.applicationNumber} - {app.borrowerName} - {formatCurrency(app.amount)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              value={formData.adjustmentType}
              label="Adjustment Type"
              onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
            >
              {ADJUSTMENT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Adjustment Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Reason"
            multiline
            rows={4}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Adjustment
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
        <DialogTitle>Adjustment Details</DialogTitle>
        <DialogContent>
          {selectedAdjustment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Adjustment Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedAdjustment.adjustmentNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Borrower
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedAdjustment.borrowerName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Type
              </Typography>
              <Typography variant="body1" gutterBottom>
                {getAdjustmentTypeLabel(selectedAdjustment.adjustmentType)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatCurrency(selectedAdjustment.amount)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Reason
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedAdjustment.reason}
              </Typography>
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



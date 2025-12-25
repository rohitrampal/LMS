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
import { generateId, generateApplicationNumber, formatCurrency, formatDate, generateRepaymentSchedule } from '@/utils/helpers';

export default function LoanDisbursementsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    loanDisbursements,
    loanApplications,
    accounts,
    currentUser,
    addLoanDisbursement,
    updateLoanApplication,
    updateAccount,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedDisbursement, setSelectedDisbursement] = useState<any>(null);
  const [formData, setFormData] = useState({
    loanApplicationId: '',
    disbursedTo: '',
  });
  const [error, setError] = useState('');

  const bankId = currentUser?.bankId;

  const filteredDisbursements = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanDisbursements.filter((dis) => dis.bankId === bankId);
    }
    return loanDisbursements;
  }, [loanDisbursements, currentUser, bankId]);

  const approvedApplications = useMemo(() => {
    let apps = loanApplications.filter((app) => app.status === 'approved');
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      apps = apps.filter((app) => app.bankId === bankId);
    }
    return apps.filter((app) => !loanDisbursements.some((dis) => dis.loanApplicationId === app.id));
  }, [loanApplications, loanDisbursements, currentUser, bankId]);

  const canEdit = currentUser?.role === 'superadmin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'bank' ||
    currentUser?.role === 'bank_employee';

  const handleOpen = (application?: any) => {
    if (application) {
      setSelectedApplication(application);
      setFormData({
        loanApplicationId: application.id,
        disbursedTo: application.accountNumber,
      });
    } else {
      setSelectedApplication(null);
      setFormData({
        loanApplicationId: '',
        disbursedTo: '',
      });
    }
    setError('');
    setOpen(true);
  };

  const handleView = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedApplication(null);
    setSelectedDisbursement(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.loanApplicationId) {
      setError('Please select a loan application');
      return;
    }

    const application = loanApplications.find((app) => app.id === formData.loanApplicationId);
    const account = accounts.find((acc) => acc.id === application?.accountId);

    if (!application || !account) {
      setError('Invalid application or account');
      return;
    }

    const repaymentSchedule = generateRepaymentSchedule(
      application.amount,
      application.interestRate,
      application.tenureMonths,
      new Date()
    );

    const newDisbursement = {
      id: generateId(),
      disbursementNumber: generateApplicationNumber('DIS'),
      loanApplicationId: application.id,
      accountId: application.accountId,
      borrowerName: application.borrowerName,
      accountNumber: application.accountNumber,
      amount: application.amount,
      disbursedTo: formData.disbursedTo || application.accountNumber,
      disbursedBy: currentUser?.id || '',
      bankId: application.bankId,
      bankName: application.bankName,
      disbursedAt: new Date().toISOString(),
      repaymentSchedule,
    };

    addLoanDisbursement(newDisbursement);

    // Update loan application status
    updateLoanApplication(application.id, {
      status: 'active',
    });

    // Update account balance
    updateAccount(account.id, {
      balance: account.balance + application.amount,
    });

    // Send email notification
    const borrowerAccount = accounts.find((acc) => acc.id === application.accountId);
    if (borrowerAccount?.email) {
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'loan-disbursement',
            to: borrowerAccount.email,
            borrowerName: application.borrowerName,
            loanAmount: application.amount,
            repaymentSchedule,
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    handleClose();
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
          Loan Disbursements
        </Typography>
        {canEdit && approvedApplications.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 170 } }}
          >
            New Disbursement
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 600,
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
              <TableCell>Disbursement #</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Disbursed Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDisbursements.map((disbursement) => (
              <TableRow key={disbursement.id}>
                <TableCell>{disbursement.disbursementNumber}</TableCell>
                <TableCell>{disbursement.borrowerName}</TableCell>
                <TableCell>{formatCurrency(disbursement.amount)}</TableCell>
                <TableCell>{disbursement.accountNumber}</TableCell>
                <TableCell>{formatDate(disbursement.disbursedAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(disbursement)} size="small">
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
        <DialogTitle>New Disbursement</DialogTitle>
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
              onChange={(e) => {
                const app = loanApplications.find((a) => a.id === e.target.value);
                setFormData({
                  loanApplicationId: e.target.value,
                  disbursedTo: app?.accountNumber || '',
                });
                setSelectedApplication(app);
              }}
            >
              {approvedApplications.map((app) => (
                <MenuItem key={app.id} value={app.id}>
                  {app.applicationNumber} - {app.borrowerName} - {formatCurrency(app.amount)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedApplication && (
            <>
              <Alert severity="info" sx={{ mt: 2 }}>
                Amount: {formatCurrency(selectedApplication.amount)}
                <br />
                Interest Rate: {selectedApplication.interestRate}%
                <br />
                Tenure: {selectedApplication.tenureMonths} months
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Disburse
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
        <DialogTitle>Disbursement Details</DialogTitle>
        <DialogContent>
          {selectedDisbursement && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Disbursement Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedDisbursement.disbursementNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Borrower
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedDisbursement.borrowerName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatCurrency(selectedDisbursement.amount)}
              </Typography>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Repayment Schedule
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Installment</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDisbursement.repaymentSchedule?.map((schedule: any) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.installmentNumber}</TableCell>
                        <TableCell>{formatDate(schedule.dueDate)}</TableCell>
                        <TableCell>{formatCurrency(schedule.principalAmount)}</TableCell>
                        <TableCell>{formatCurrency(schedule.interestAmount)}</TableCell>
                        <TableCell>{formatCurrency(schedule.totalAmount)}</TableCell>
                        <TableCell>{schedule.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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


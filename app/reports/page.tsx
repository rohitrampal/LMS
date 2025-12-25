'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function ReportsPage() {
  const {
    loanApplications,
    loanDisbursements,
    loanAdjustments,
    accounts,
    currentUser,
  } = useStore();
  const [reportType, setReportType] = useState('loans');

  const bankId = currentUser?.bankId;

  const filteredLoans = React.useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanApplications.filter((app) => app.bankId === bankId);
    }
    return loanApplications;
  }, [loanApplications, currentUser, bankId]);

  const filteredDisbursements = React.useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanDisbursements.filter((dis) => dis.bankId === bankId);
    }
    return loanDisbursements;
  }, [loanDisbursements, currentUser, bankId]);

  const filteredAdjustments = React.useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanAdjustments.filter((adj) => adj.bankId === bankId);
    }
    return loanAdjustments;
  }, [loanAdjustments, currentUser, bankId]);

  const handleExport = () => {
    // In a real app, this would export to CSV/PDF
    console.log('Exporting report:', reportType);
    alert('Export functionality would be implemented here');
  };

  const renderLoanReport = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Application #</TableCell>
            <TableCell>Borrower</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Applied Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLoans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.applicationNumber}</TableCell>
              <TableCell>{loan.borrowerName}</TableCell>
              <TableCell>{formatCurrency(loan.amount)}</TableCell>
              <TableCell>{loan.status}</TableCell>
              <TableCell>{formatDate(loan.appliedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderDisbursementReport = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Disbursement #</TableCell>
            <TableCell>Borrower</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Disbursed Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDisbursements.map((dis) => (
            <TableRow key={dis.id}>
              <TableCell>{dis.disbursementNumber}</TableCell>
              <TableCell>{dis.borrowerName}</TableCell>
              <TableCell>{formatCurrency(dis.amount)}</TableCell>
              <TableCell>{formatDate(dis.disbursedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAdjustmentReport = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Adjustment #</TableCell>
            <TableCell>Borrower</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAdjustments.map((adj) => (
            <TableRow key={adj.id}>
              <TableCell>{adj.adjustmentNumber}</TableCell>
              <TableCell>{adj.borrowerName}</TableCell>
              <TableCell>{adj.adjustmentType}</TableCell>
              <TableCell>{formatCurrency(adj.amount)}</TableCell>
              <TableCell>{formatDate(adj.adjustedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="loans">Loan Applications</MenuItem>
              <MenuItem value="disbursements">Loan Disbursements</MenuItem>
              <MenuItem value="adjustments">Loan Adjustments</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Download />} onClick={handleExport}>
            Export
          </Button>
        </Box>
      </Box>

      <Paper>
        <Box sx={{ p: 3 }}>
          {reportType === 'loans' && renderLoanReport()}
          {reportType === 'disbursements' && renderDisbursementReport()}
          {reportType === 'adjustments' && renderAdjustmentReport()}
        </Box>
      </Paper>
    </Box>
  );
}



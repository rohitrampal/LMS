'use client';

import React, { useState, useMemo } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  People,
  AccountBalance,
  RequestQuote,
  TrendingUp,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/helpers';

export default function BankAdminDashboard() {
  const { currentUser, bankEmployees, accounts, loanApplications } = useStore();
  const [employeeFilter, setEmployeeFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loanStatusFilter, setLoanStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  const bankId = currentUser?.bankId;

  const filteredEmployees = useMemo(() => {
    if (!bankId) return [];
    let employees = bankEmployees.filter((emp) => emp.bankId === bankId);
    
    if (employeeFilter === 'active') {
      employees = employees.filter((emp) => emp.isActive);
    } else if (employeeFilter === 'inactive') {
      employees = employees.filter((emp) => !emp.isActive);
    }
    
    return employees;
  }, [bankEmployees, bankId, employeeFilter]);

  const filteredAccounts = useMemo(() => {
    if (!bankId) return [];
    return accounts.filter((acc) => acc.bankId === bankId);
  }, [accounts, bankId]);

  const filteredLoans = useMemo(() => {
    if (!bankId) return [];
    let loans = loanApplications.filter((app) => app.bankId === bankId);
    
    if (loanStatusFilter !== 'all') {
      loans = loans.filter((app) => app.status === loanStatusFilter);
    }
    
    return loans;
  }, [loanApplications, bankId, loanStatusFilter]);

  const activeEmployees = filteredEmployees.filter((emp) => emp.isActive).length;
  const inactiveEmployees = filteredEmployees.filter((emp) => !emp.isActive).length;

  const getGrowthData = () => {
    const now = new Date();
    const data: any[] = [];
    
    if (timeFilter === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        const loans = filteredLoans.filter(
          (app) => new Date(app.appliedAt).toDateString() === date.toDateString()
        );
        const amount = loans.reduce((sum, app) => sum + app.amount, 0);
        data.push({ name: dateStr, loans: loans.length, amount });
      }
    } else if (timeFilter === 'month') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
        const loans = filteredLoans.filter(
          (app) => {
            const appDate = new Date(app.appliedAt);
            return appDate.getMonth() === date.getMonth() && 
                   appDate.getFullYear() === date.getFullYear();
          }
        );
        const amount = loans.reduce((sum, app) => sum + app.amount, 0);
        data.push({ name: monthStr, loans: loans.length, amount });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const loans = filteredLoans.filter(
          (app) => new Date(app.appliedAt).getFullYear() === year
        );
        const amount = loans.reduce((sum, app) => sum + app.amount, 0);
        data.push({ name: year.toString(), loans: loans.length, amount });
      }
    }
    
    return data;
  };

  const loanStatusData = [
    {
      status: 'Pending',
      count: loanApplications.filter((app) => app.bankId === bankId && app.status === 'pending').length,
    },
    {
      status: 'Approved',
      count: loanApplications.filter((app) => app.bankId === bankId && app.status === 'approved').length,
    },
    {
      status: 'Disbursed',
      count: loanApplications.filter((app) => app.bankId === bankId && app.status === 'disbursed').length,
    },
    {
      status: 'Active',
      count: loanApplications.filter((app) => app.bankId === bankId && app.status === 'active').length,
    },
    {
      status: 'Closed',
      count: loanApplications.filter((app) => app.bankId === bankId && app.status === 'closed').length,
    },
  ];

  const totalLoanAmount = filteredLoans.reduce((sum, app) => sum + app.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Bank Admin Dashboard - {currentUser?.bankName}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Employees
                  </Typography>
                  <Typography variant="h4">{filteredEmployees.length}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Active: {activeEmployees} | Inactive: {inactiveEmployees}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Customers
                  </Typography>
                  <Typography variant="h4">{filteredAccounts.length}</Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Loans
                  </Typography>
                  <Typography variant="h4">{filteredLoans.length}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatCurrency(totalLoanAmount)}
                  </Typography>
                </Box>
                <RequestQuote sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Loans
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {loanApplications.filter((app) => app.bankId === bankId && app.status === 'pending').length}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Growth Trends</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Time Period</InputLabel>
                  <Select
                    value={timeFilter}
                    label="Time Period"
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                  >
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getGrowthData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loans" stroke="#8884d8" name="Number of Loans" />
                  <Line type="monotone" dataKey="amount" stroke="#82ca9d" name="Loan Amount ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Loan Status</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={loanStatusFilter}
                    label="Filter"
                    onChange={(e) => setLoanStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="disbursed">Disbursed</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={loanStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employee Status
              </Typography>
              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel>Filter Employees</InputLabel>
                <Select
                  value={employeeFilter}
                  label="Filter Employees"
                  onChange={(e) => setEmployeeFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Total: <strong>{filteredEmployees.length}</strong>
                </Typography>
                <Typography variant="body1">
                  Active: <strong>{activeEmployees}</strong>
                </Typography>
                <Typography variant="body1">
                  Inactive: <strong>{inactiveEmployees}</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



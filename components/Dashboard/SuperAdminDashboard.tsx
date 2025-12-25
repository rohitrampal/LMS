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
  AccountBalance,
  People,
  TrendingUp,
  TrendingDown,
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

export default function SuperAdminDashboard() {
  const { banks, users, bankEmployees, loanApplications } = useStore();
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  const filteredEmployees = useMemo(() => {
    if (selectedBank === 'all') return bankEmployees;
    return bankEmployees.filter((emp) => emp.bankId === selectedBank);
  }, [bankEmployees, selectedBank]);

  const activeBanks = banks.filter((b) => b.isActive).length;
  const inactiveBanks = banks.filter((b) => !b.isActive).length;

  const activeLoans = loanApplications.filter(
    (app) => app.status === 'active' || app.status === 'disbursed'
  ).length;
  const pendingLoans = loanApplications.filter(
    (app) => app.status === 'pending'
  ).length;

  const getGrowthData = () => {
    const now = new Date();
    const data: any[] = [];
    
    if (timeFilter === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        const apps = loanApplications.filter(
          (app) => new Date(app.appliedAt).toDateString() === date.toDateString()
        );
        data.push({ name: dateStr, loans: apps.length, employees: 0 });
      }
    } else if (timeFilter === 'month') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
        const apps = loanApplications.filter(
          (app) => {
            const appDate = new Date(app.appliedAt);
            return appDate.getMonth() === date.getMonth() && 
                   appDate.getFullYear() === date.getFullYear();
          }
        );
        const emps = filteredEmployees.filter(
          (emp) => {
            const empDate = new Date(emp.createdAt);
            return empDate.getMonth() === date.getMonth() && 
                   empDate.getFullYear() === date.getFullYear();
          }
        );
        data.push({ name: monthStr, loans: apps.length, employees: emps.length });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const apps = loanApplications.filter(
          (app) => new Date(app.appliedAt).getFullYear() === year
        );
        const emps = filteredEmployees.filter(
          (emp) => new Date(emp.createdAt).getFullYear() === year
        );
        data.push({ name: year.toString(), loans: apps.length, employees: emps.length });
      }
    }
    
    return data;
  };

  const bankStats = banks.map((bank) => ({
    name: bank.name,
    loans: loanApplications.filter((app) => app.bankId === bank.id).length,
    employees: bankEmployees.filter((emp) => emp.bankId === bank.id).length,
    active: bank.isActive ? 1 : 0,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Super Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Banks
                  </Typography>
                  <Typography variant="h4">{banks.length}</Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Employees
                  </Typography>
                  <Typography variant="h4">{filteredEmployees.length}</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Banks
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {activeBanks}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Inactive Banks
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {inactiveBanks}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Bank Statistics</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Filter Bank</InputLabel>
                  <Select
                    value={selectedBank}
                    label="Filter Bank"
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <MenuItem value="all">All Banks</MenuItem>
                    {banks.map((bank) => (
                      <MenuItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bankStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="loans" fill="#8884d8" name="Loans" />
                  <Bar dataKey="employees" fill="#82ca9d" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  <Line type="monotone" dataKey="loans" stroke="#8884d8" name="Loan Applications" />
                  <Line type="monotone" dataKey="employees" stroke="#82ca9d" name="Employees Added" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Status Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Active Loans: <strong>{activeLoans}</strong>
                </Typography>
                <Typography variant="body1">
                  Pending Loans: <strong>{pendingLoans}</strong>
                </Typography>
                <Typography variant="body1">
                  Total Loans: <strong>{loanApplications.length}</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



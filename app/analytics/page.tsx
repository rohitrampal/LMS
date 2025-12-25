'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '@/store/useStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const { banks, loanApplications, accounts, loanDisbursements } = useStore();

  const loanStatusData = [
    { name: 'Pending', value: loanApplications.filter((a) => a.status === 'pending').length },
    { name: 'Approved', value: loanApplications.filter((a) => a.status === 'approved').length },
    { name: 'Disbursed', value: loanApplications.filter((a) => a.status === 'disbursed').length },
    { name: 'Active', value: loanApplications.filter((a) => a.status === 'active').length },
    { name: 'Closed', value: loanApplications.filter((a) => a.status === 'closed').length },
  ];

  const bankLoanData = banks.map((bank) => ({
    name: bank.name,
    loans: loanApplications.filter((app) => app.bankId === bank.id).length,
    accounts: accounts.filter((acc) => acc.bankId === bank.id).length,
  }));

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
    const apps = loanApplications.filter((app) => {
      const appDate = new Date(app.appliedAt);
      return (
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
    return {
      month: monthStr,
      applications: apps.length,
      disbursements: loanDisbursements.filter((dis) => {
        const disDate = new Date(dis.disbursedAt);
        return (
          disDate.getMonth() === date.getMonth() &&
          disDate.getFullYear() === date.getFullYear()
        );
      }).length,
    };
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bank Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bankLoanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="loans" fill="#8884d8" name="Loans" />
                  <Bar dataKey="accounts" fill="#82ca9d" name="Accounts" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
                  <Line type="monotone" dataKey="disbursements" stroke="#82ca9d" name="Disbursements" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



'use client';

import React from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { AccountBalance, RequestQuote, Payment } from '@mui/icons-material';
import { useStore } from '@/store/useStore';

export default function BankEmployeeDashboard() {
  const { currentUser, accounts, loanApplications, loanDisbursements } = useStore();
  const bankId = currentUser?.bankId;

  const bankAccounts = accounts.filter((acc) => acc.bankId === bankId);
  const bankLoans = loanApplications.filter((app) => app.bankId === bankId);
  const bankDisbursements = loanDisbursements.filter((dis) => dis.bankId === bankId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Bank Employee Dashboard - {currentUser?.bankName}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Accounts
                  </Typography>
                  <Typography variant="h4">{bankAccounts.length}</Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Loans
                  </Typography>
                  <Typography variant="h4">{bankLoans.length}</Typography>
                </Box>
                <RequestQuote sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Disbursements
                  </Typography>
                  <Typography variant="h4">{bankDisbursements.length}</Typography>
                </Box>
                <Payment sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



'use client';

import React from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { AccountBalance, RequestQuote, Assessment } from '@mui/icons-material';
import { useStore } from '@/store/useStore';

export default function RegulatorDashboard() {
  const { banks, loanApplications, accounts } = useStore();

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Regulator Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Loans
                  </Typography>
                  <Typography variant="h4">{loanApplications.length}</Typography>
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
                    Total Accounts
                  </Typography>
                  <Typography variant="h4">{accounts.length}</Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



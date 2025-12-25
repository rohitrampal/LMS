'use client';

import React from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { AccountBalance, Gavel, TrendingUp } from '@mui/icons-material';
import { useStore } from '@/store/useStore';

export default function AdminDashboard() {
  const { banks, regulators } = useStore();

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
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
                    Total Regulators
                  </Typography>
                  <Typography variant="h4">{regulators.length}</Typography>
                </Box>
                <Gavel sx={{ fontSize: 40, color: 'secondary.main' }} />
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
                    Active Banks
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {banks.filter((b) => b.isActive).length}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



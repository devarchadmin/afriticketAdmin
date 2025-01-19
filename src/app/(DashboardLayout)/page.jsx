'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

import PageContainer from '@/app/components/container/PageContainer';
// components
import YearlyBreakup from '@/app/components/dashboards/modern/YearlyBreakup';
import MonthlyEarnings from '@/app/components/dashboards/modern/MonthlyEarnings';
import TopCards from '@/app/components/dashboards/modern/TopCards';
import RevenueUpdates from '@/app/components/dashboards/modern/RevenueUpdates';
import WeeklyStats from '@/app/components/dashboards/modern/WeeklyStats';
import TopPerformers from '@/app/components/dashboards/modern/TopPerformers';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer title="Tableau de bord | AfrikTicket">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} lg={12}>
            <TopCards />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            <RevenueUpdates isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={12}>
                <YearlyBreakup isLoading={isLoading} />
              </Grid>
              <Grid item xs={12} sm={6} lg={12}>
                <MonthlyEarnings isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
         
          {/* column */}
      
          {/* column */}
         
          {/* column */}
          <Grid item xs={12} lg={12}>
            <WeeklyStats isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={12}>
            <TopPerformers />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

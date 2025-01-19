import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { 
  Stack, 
  Typography, 
  Avatar, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  TextField 
} from '@mui/material';
import { 
  IconTicket, 
  IconCurrencyDollar, 
  IconUsers, 
  IconReport 
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import DashboardCard from '../../shared/DashboardCard';
import SkeletonWeeklyStatsCard from '../skeleton/WeeklyStats';

const WeeklyStats = ({ isLoading }) => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  // Get theme colors
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;

  // Get data from Redux store
  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);
  const organizations = useSelector(state => state.organizationReducer?.organizations || []);

  // Calculate weekly statistics
  const calculateWeeklyStats = () => {
    const now = new Date();
    const weeklyData = Array(5).fill(0);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    
    const weeklyDetails = {
      events: Array(5).fill(0),
      funds: Array(5).fill(0)
    };
    
    // Process events and funds for the last 5 weeks
    events.forEach(item => {
      if (!item.deleted) {
        const itemDate = new Date(item.Date);
        const weekDiff = Math.floor((now - itemDate) / msPerWeek);
        
        if (weekDiff >= 0 && weekDiff < 5) {
          const revenue = parseInt(item.numberOfTickets) * parseFloat(item.ticketPrice);
          weeklyData[4 - weekDiff] += revenue;
          weeklyDetails.events[4 - weekDiff]++;
        }
      }
    });

    funds.forEach(item => {
      if (!item.deleted) {
        const itemDate = new Date(item.deadline);
        const weekDiff = Math.floor((now - itemDate) / msPerWeek);
        
        if (weekDiff >= 0 && weekDiff < 5) {
          weeklyData[4 - weekDiff] += item.raisedAmount;
          weeklyDetails.funds[4 - weekDiff]++;
        }
      }
    });

    return { weeklyData, weeklyDetails };
  };

  // Find top performers
  const findTopPerformers = () => {
    // Top event by ticket revenue
    const topEvent = [...events]
      .filter(e => !e.deleted)
      .sort((a, b) => 
        (parseInt(b.numberOfTickets) * parseFloat(b.ticketPrice)) - 
        (parseInt(a.numberOfTickets) * parseFloat(a.ticketPrice))
      )[0];

    // Top fund by amount raised
    const topFund = [...funds]
      .filter(f => !f.deleted)
      .sort((a, b) => b.raisedAmount - a.raisedAmount)[0];

    // Most active category
    const categoryCount = new Map();
    events.forEach(event => {
      if (!event.deleted) {
        const category = event.category || 'Général';
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    });
    const topCategory = [...categoryCount.entries()]
      .sort((a, b) => b[1] - a[1])[0] || ['Général', 0];

    return {
      topEvent,
      topFund,
      topCategory
    };
  };

  const { weeklyData, weeklyDetails } = calculateWeeklyStats();
  const { topEvent, topFund, topCategory } = findTopPerformers();

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    return previous ? Math.round((current - previous) / previous * 100) : 0;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M GF`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K GF`;
    return `${amount.toFixed(0)} GF`;
  };

  // Chart configuration
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 130,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    markers: { size: 0 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: { show: false },
      y: { formatter: (value) => formatCurrency(value) }
    },
  };

  const seriescolumnchart = [
    {
      name: 'Revenu Hebdomadaire',
      color: primary,
      data: weeklyData,
    },
  ];

  const stats = [
    {
      title: 'Événement Principal',
      subtitle: topEvent ? topEvent.ticketTitle : 'N/A',
      percent: calculateGrowth(
        parseInt(topEvent?.numberOfTickets || 0) * parseFloat(topEvent?.ticketPrice || 0),
        weeklyData[3]
      ),
      color: primary,
      lightcolor: primarylight,
      icon: <IconTicket width={18} />,
    },
    {
      title: 'Meilleur Fonds',
      subtitle: topFund ? topFund.title : 'N/A',
      percent: calculateGrowth(topFund?.raisedAmount || 0, weeklyData[3]),
      color: success,
      lightcolor: successlight,
      icon: <IconCurrencyDollar width={18} />,
    },
    {
      title: 'Plus Actif',
      subtitle: topCategory[0],
      percent: topCategory[1],
      color: error,
      lightcolor: errorlight,
      icon: <IconUsers width={18} />,
    },
  ];

  const handleOpenDetails = () => {
    setOpenDetailDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailDialog(false);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonWeeklyStatsCard />
      ) : (
        <DashboardCard 
          title="Statistiques Hebdomadaires" 
          subtitle="Tendance des revenus"
          action={
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<IconReport />}
              onClick={handleOpenDetails}
            >
              Détails
            </Button>
          }
        >
          <>
            <Stack mt={4}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="area"
                height={130}
                width={'100%'}
              />
            </Stack>
            <Stack spacing={3} mt={3}>
              {stats.map((stat, i) => (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  key={i}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      variant="rounded"
                      sx={{ bgcolor: stat.lightcolor, color: stat.color, width: 40, height: 40 }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" mb="4px">
                        {stat.title}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {stat.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                  <Avatar
                    sx={{
                      bgcolor: stat.lightcolor,
                      color: stat.color,
                      width: 42,
                      height: 24,
                      borderRadius: '4px',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600">
                      +{stat.percent}
                    </Typography>
                  </Avatar>
                </Stack>
              ))}
            </Stack>
          </>
        </DashboardCard>
      )}

      {/* Detailed Report Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Rapport Hebdomadaire Détaillé</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Revenu Hebdomadaire Total"
                value={formatCurrency(weeklyData[0])}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre d'Événements cette Semaine"
                value={weeklyDetails.events[0]}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre de Collectes cette Semaine"
                value={weeklyDetails.funds[0]}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre Total d'Organisations"
                value={organizations.length}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Événement Principal"
                value={topEvent?.ticketTitle || 'N/A'}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Meilleur Fonds"
                value={topFund?.title || 'N/A'}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyStats;
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { 
  Grid, 
  Stack, 
  Typography, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button 
} from '@mui/material';
import { 
  IconArrowUpLeft, 
  IconArrowDownRight, 
  IconReport 
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import DashboardCard from '../../shared/DashboardCard';
import SkeletonYearlyBreakupCard from '../skeleton/YearlyBreakupCard';
import { useState } from 'react';

const YearlyBreakup = ({ isLoading }) => {
  const theme = useTheme();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;
  const errorlight = theme.palette.error.light;

  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);
  const organizations = useSelector(state => state.organizationReducer?.organizations || []);

  const calculateYearlyStats = () => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const stats = {
      [currentYear]: { 
        events: 0, 
        funds: 0, 
        total: 0,
        eventCount: 0,
        fundraiserCount: 0
      },
      [lastYear]: { 
        events: 0, 
        funds: 0, 
        total: 0,
        eventCount: 0,
        fundraiserCount: 0
      }
    };

    events.forEach(event => {
      if (!event.deleted) {
        const eventYear = new Date(event.Date).getFullYear();
        if (stats[eventYear]) {
          const revenue = parseInt(event.numberOfTickets) * parseFloat(event.ticketPrice);
          stats[eventYear].events += revenue;
          stats[eventYear].total += revenue;
          stats[eventYear].eventCount++;
        }
      }
    });

    funds.forEach(fund => {
      if (!fund.deleted) {
        const fundYear = new Date(fund.deadline).getFullYear();
        if (stats[fundYear]) {
          stats[fundYear].funds += fund.raisedAmount;
          stats[fundYear].total += fund.raisedAmount;
          stats[fundYear].fundraiserCount++;
        }
      }
    });

    return stats;
  };

  const yearlyStats = calculateYearlyStats();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const yoyGrowth = ((yearlyStats[currentYear].total - yearlyStats[lastYear].total) / 
                     yearlyStats[lastYear].total * 100).toFixed(1);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M GF`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K GF`;
    return `${amount.toFixed(0)} GF`;
  };

  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: { width: 120 },
        },
      },
    ],
  };

  const seriescolumnchart = [
    yearlyStats[currentYear].events,
    yearlyStats[currentYear].funds,
    yearlyStats[lastYear].total
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
        <SkeletonYearlyBreakupCard />
      ) : (
        <DashboardCard 
          title="Collecte Annuelle"
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
          <Grid container spacing={3}>
            <Grid item xs={7} sm={7}>
              <Typography variant="h3" fontWeight="700">
                {formatCurrency(yearlyStats[currentYear].total)}
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar 
                  sx={{ 
                    bgcolor: yoyGrowth >= 0 ? successlight : errorlight, 
                    width: 27, 
                    height: 27 
                  }}
                >
                  {yoyGrowth >= 0 ? (
                    <IconArrowUpLeft width={20} color="#39B69A" />
                  ) : (
                    <IconArrowDownRight width={20} color="#FA896B" />
                  )}
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth}%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                l'année dernière
                </Typography>
              </Stack>
              <Stack spacing={3} mt={5} direction="row">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                  ></Avatar>
                  <Typography variant="subtitle2" color="textSecondary">
                    Événements {currentYear}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
                  ></Avatar>
                  <Typography variant="subtitle2" color="textSecondary">
                    Collectes {currentYear}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={150}
                width={'100%'}
              />
            </Grid>
          </Grid>
        </DashboardCard>
      )}

      {/* Detailed Report Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Rapport Annuel Détaillé</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label={`Revenus des Événements (${currentYear})`}
                value={formatCurrency(yearlyStats[currentYear].events)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`Revenus des Collectes (${currentYear})`}
                value={formatCurrency(yearlyStats[currentYear].funds)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`Nombre d'Événements (${currentYear})`}
                value={yearlyStats[currentYear].eventCount}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`Nombre de Collectes (${currentYear})`}
                value={yearlyStats[currentYear].fundraiserCount}
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
                label="Croissance Année-sur-Année"
                value={`${yoyGrowth}%`}
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

export default YearlyBreakup;
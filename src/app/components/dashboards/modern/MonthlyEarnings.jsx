import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Stack, 
  Typography, 
  Avatar, 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  TextField, 
  Button 
} from '@mui/material';
import { 
  IconArrowDownRight, 
  IconArrowUpLeft, 
  IconCurrencyDollar,
  IconReport 
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import DashboardCard from '../../shared/DashboardCard';
import SkeletonMonthlyEarningsTwoCard from "../skeleton/MonthlyEarningsTwoCard";

const MonthlyEarnings = ({ isLoading }) => {
  const theme = useTheme();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const errorlight = theme.palette.error.light;
  const successlight = theme.palette.success.light;

  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);
  const organizations = useSelector(state => state.organizationReducer?.organizations || []);

  const calculateMonthlyEarnings = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const lastYear = currentYear - 1;
    
    const monthlyTotals = Array(7).fill(0);
    let totalCurrentYear = 0;
    let totalLastYear = 0;
    let monthlyEventCounts = Array(7).fill(0);
    let monthlyFundCounts = Array(7).fill(0);

    events.forEach(event => {
      if (!event.deleted) {
        const eventDate = new Date(event.Date);
        const revenue = parseInt(event.numberOfTickets) * parseFloat(event.ticketPrice);

        if (eventDate.getFullYear() === currentYear) {
          totalCurrentYear += revenue;
          const monthIndex = currentDate.getMonth() - eventDate.getMonth();
          if (monthIndex >= 0 && monthIndex < 7) {
            monthlyTotals[6 - monthIndex] += revenue;
            monthlyEventCounts[6 - monthIndex]++;
          }
        } else if (eventDate.getFullYear() === lastYear) {
          totalLastYear += revenue;
        }
      }
    });

    funds.forEach(fund => {
      if (!fund.deleted) {
        const fundDate = new Date(fund.deadline);
        const amount = fund.raisedAmount;

        if (fundDate.getFullYear() === currentYear) {
          totalCurrentYear += amount;
          const monthIndex = currentDate.getMonth() - fundDate.getMonth();
          if (monthIndex >= 0 && monthIndex < 7) {
            monthlyTotals[6 - monthIndex] += amount;
            monthlyFundCounts[6 - monthIndex]++;
          }
        } else if (fundDate.getFullYear() === lastYear) {
          totalLastYear += amount;
        }
      }
    });

    const yoyGrowth = totalLastYear ? ((totalCurrentYear - totalLastYear) / totalLastYear * 100) : 0;

    return {
      monthlyTotals,
      currentMonthTotal: monthlyTotals[6],
      monthlyEventCounts,
      monthlyFundCounts,
      yoyGrowth: yoyGrowth.toFixed(1),
      totalCurrentYear,
      totalLastYear
    };
  };

  const monthlyEarnings = calculateMonthlyEarnings();

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M GF`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K GF`;
    return `${amount.toFixed(0)} GF`;
  };

  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: { size: 0 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        formatter: function(val) {
          const today = new Date();
          const date = new Date(today.getFullYear(), today.getMonth() - (6 - val), 1);
          return date.toLocaleString('fr-FR', { month: 'short' });
        }
      },
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    },
  };

  const seriescolumnchart = [
    {
      name: 'Recettes',
      color: secondary,
      data: monthlyEarnings.monthlyTotals,
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
        <SkeletonMonthlyEarningsTwoCard />
      ) : (
        <DashboardCard
          title="Collecte Mensuelle"
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
          footer={
            <Chart 
              options={optionscolumnchart} 
              series={seriescolumnchart} 
              type="area" 
              height={60} 
              width={"100%"} 
            />
          }
        >
          <>
            <Typography variant="h3" fontWeight="700" mt="-20px">
              {formatCurrency(monthlyEarnings.currentMonthTotal)}
            </Typography>
            <Stack direction="row" spacing={1} my={1} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: parseFloat(monthlyEarnings.yoyGrowth) >= 0 ? successlight : errorlight, 
                  width: 27, 
                  height: 27 
                }}
              >
                {parseFloat(monthlyEarnings.yoyGrowth) >= 0 ? (
                  <IconArrowUpLeft width={20} color="#39B69A" />
                ) : (
                  <IconArrowDownRight width={20} color="#FA896B" />
                )}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                {monthlyEarnings.yoyGrowth >= 0 ? '+' : ''}{monthlyEarnings.yoyGrowth}%
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                par rapport à l'année dernière
              </Typography>
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
        <DialogTitle>Rapport Mensuel Détaillé</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Revenu Mensuel Total"
                value={formatCurrency(monthlyEarnings.currentMonthTotal)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre d'Événements ce Mois"
                value={monthlyEarnings.monthlyEventCounts[6]}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre de Collectes ce Mois"
                value={monthlyEarnings.monthlyFundCounts[6]}
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
                label="Revenu Total de l'Année"
                value={formatCurrency(monthlyEarnings.totalCurrentYear)}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Croissance Année-sur-Année"
                value={`${monthlyEarnings.yoyGrowth}%`}
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

export default MonthlyEarnings;
'use client';
import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { 
  MenuItem, 
  Grid, 
  Stack, 
  Typography, 
  Button, 
  Avatar, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField 
} from '@mui/material';
import { 
  IconGridDots, 
  IconTicket, 
  IconHeartHandshake, 
  IconReport 
} from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import SkeletonRevenueUpdatesTwoCard from '../skeleton/RevenueUpdatesTwoCard';

const RevenueUpdates = ({ isLoading }) => {
  const [month, setMonth] = useState('1');
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);
  const organizations = useSelector(state => state.organizationReducer?.organizations || []);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // Calculate monthly data for the last 6 months
  const calculateMonthlyData = () => {
    const monthlyData = Array(6).fill().map(() => ({
      events: 0,
      fundraisers: 0
    }));

    const currentDate = new Date();
    
    events.forEach(event => {
      const eventDate = new Date(event.Date);
      const monthDiff = currentDate.getMonth() - eventDate.getMonth();
      if (monthDiff >= 0 && monthDiff < 6) {
        const ticketRevenue = parseFloat(event.ticketPrice) * (parseInt(event.numberOfTickets) || 0);
        monthlyData[5 - monthDiff].events += ticketRevenue / 1000;
      }
    });

    funds.forEach(fund => {
      const fundDate = new Date(fund.deadline);
      const monthDiff = currentDate.getMonth() - fundDate.getMonth();
      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyData[5 - monthDiff].fundraisers += (fund.raisedAmount || 0) / 1000;
      }
    });

    return monthlyData;
  };

  const monthlyRevenueData = calculateMonthlyData();

  // Calculate total revenues
  const totalEventRevenue = events.reduce((sum, event) => 
    sum + (parseFloat(event.ticketPrice) * (parseInt(event.numberOfTickets) || 0)), 0);
  const totalFundRevenue = funds.reduce((sum, fund) => 
    sum + (fund.raisedAmount || 0), 0);
  const totalRevenue = totalEventRevenue + totalFundRevenue;

  // Prepare chart configuration
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 360,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'top',
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}K GF`
      }
    },
    xaxis: {
      categories: ['Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value) => `${value}K GF`
      }
    },
  };
  const seriescolumnchart = [
    {
      name: 'Revenus Événements',
      data: monthlyRevenueData.map(data => data.events),
    },
    {
      name: 'Revenus Collecte de Fonds',
      data: monthlyRevenueData.map(data => data.fundraisers),
    },
  ];

  // Open full report dialog
  const handleOpenReport = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReport = () => {
    setOpenReportDialog(false);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonRevenueUpdatesTwoCard />
      ) : (
        <DashboardCard
          title="Performance Financière"
          subtitle="Détails des revenus et collectes"
          action={
            <CustomSelect
              labelId="month-dd"
              id="month-dd"
              size="small"
              value={month}
              onChange={handleChange}
            >
              <MenuItem value={1}>Semestre 2024</MenuItem>
              <MenuItem value={2}>Semestre 2025</MenuItem>
            </CustomSelect>
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Box className="rounded-bars">
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="bar"
                  height={360}
                  width={"100%"}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={3} mt={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    width={40}
                    height={40}
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography color="primary" variant="h6" display="flex">
                      <IconGridDots size={24} />
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight="700">
                      {totalRevenue.toLocaleString()} GF
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Revenu Total
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              <Stack spacing={3} my={5}>
                <Stack direction="row" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: primary }}>
                    <IconTicket size={18} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      Revenus Événements
                    </Typography>
                    <Typography variant="h5">
                      {totalEventRevenue.toLocaleString()} GF
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: secondary }}>
                    <IconHeartHandshake size={18} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      Revenus Collecte de Fonds
                    </Typography>
                    <Typography variant="h5">
                      {totalFundRevenue.toLocaleString()} GF
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "success.main" }}>
                    <IconReport size={18} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      Nombre d'Organisations
                    </Typography>
                    <Typography variant="h5">
                      {organizations.length}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              <Button 
                color="primary" 
                variant="contained" 
                fullWidth 
                startIcon={<IconReport />}
                onClick={handleOpenReport}
              >
                Générer un rapport détaillé
              </Button>
            </Grid>
          </Grid>
        </DashboardCard>
      )}

      {/* Rapport Détaillé Dialog */}
      <Dialog 
        open={openReportDialog} 
        onClose={handleCloseReport}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Rapport Financier Détaillé</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Revenu Total des Événements"
                value={`${totalEventRevenue.toLocaleString()} GF`}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Revenu Total des Collectes"
                value={`${totalFundRevenue.toLocaleString()} GF`}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre Total d'Événements"
                value={events.length}
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
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RevenueUpdates;
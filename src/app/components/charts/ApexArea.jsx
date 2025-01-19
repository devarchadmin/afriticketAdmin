'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Paper, Box, Typography, Grid } from '@mui/material';
import React, { useMemo } from 'react';

const FinancialAreaChart = ({ transactions = [] }) => {
  // Process transaction data for the chart
  const chartData = useMemo(() => {
    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          incoming: 0,
          outgoing: 0,
          balance: 0
        };
      }
      
      if (transaction.type === 'Incoming' && transaction.status === 'Terminé') {
        acc[monthKey].incoming += transaction.amount;
      } else if (transaction.type === 'Outgoing') {
        acc[monthKey].outgoing += transaction.amount;
      }
      
      acc[monthKey].balance = acc[monthKey].incoming - acc[monthKey].outgoing;
      
      return acc;
    }, {});

    // Convert to array and sort by month
    const sortedData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      months: sortedData.map(d => {
        const [year, month] = d.month.split('-');
        return `${month}/${year.slice(2)}`;
      }),
      incoming: sortedData.map(d => d.incoming),
      outgoing: sortedData.map(d => d.outgoing),
      balance: sortedData.map(d => d.balance)
    };
  }, [transactions]);

  // Calculate overall financial metrics
  const metrics = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'Incoming' && transaction.status === 'Terminé') {
        acc.totalIncoming += transaction.amount;
      } else if (transaction.type === 'Outgoing') {
        acc.totalOutgoing += transaction.amount;
      }
      acc.currentBalance = acc.totalIncoming - acc.totalOutgoing;
      return acc;
    }, { totalIncoming: 0, totalOutgoing: 0, currentBalance: 0 });
  }, [transactions]);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 400,
      toolbar: {
        show: false
      },
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.months,
      title: {
        text: 'Mois'
      }
    },
    yaxis: {
      title: {
        text: 'Montant (GF)'
      },
      labels: {
        formatter: (value) => `${value.toLocaleString()} GF`
      }
    },
    colors: ['#2e7d32', '#d32f2f', '#1976d2'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toLocaleString()} GF`
      }
    },
    legend: {
      position: 'top'
    }
  };

  const series = [
    {
      name: 'Entrant',
      data: chartData.incoming
    },
    {
      name: 'Sortant',
      data: chartData.outgoing
    },
    {
      name: 'Solde',
      data: chartData.balance
    }
  ];

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Aperçu Financier
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'primary.light',
                color: 'primary.main'
              }}
            >
              <Typography variant="subtitle2">Solde actuel</Typography>
              <Typography variant="h4">
                {metrics.currentBalance.toLocaleString()} GF
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'success.light',
                color: 'success.main'
              }}
            >
              <Typography variant="subtitle2">Total entrant</Typography>
              <Typography variant="h4">
                {metrics.totalIncoming.toLocaleString()} GF
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'error.light',
                color: 'error.main'
              }}
            >
              <Typography variant="subtitle2">Total sortant</Typography>
              <Typography variant="h4">
                {metrics.totalOutgoing.toLocaleString()} GF
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <Chart
          options={chartOptions}
          series={series}
          type="area"
          height="400px"
        />
      </Box>
    </Paper>
  );
};

export default FinancialAreaChart;
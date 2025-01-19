import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import { useSelector } from 'react-redux';
import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import SkeletonEmployeeSalaryCard from "../skeleton/EmployeeSalaryCard";

const RevenueStats = ({ isLoading }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  // Get data from Redux store
  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);

  // Calculate monthly revenue statistics
  const calculateMonthlyStats = () => {
    const currentDate = new Date();
    const months = [];
    const monthlyRevenue = [];
    let totalRevenue = 0;
    let totalProfit = 0;

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push([date.toLocaleString('default', { month: 'short' })]);
      monthlyRevenue.push(0);
    }

    // Calculate event revenue
    events.forEach(event => {
      if (!event.deleted) {
        const eventDate = new Date(event.Date);
        const monthIndex = months.findIndex(
          m => m[0] === eventDate.toLocaleString('default', { month: 'short' })
        );
        
        const revenue = parseInt(event.numberOfTickets) * parseFloat(event.ticketPrice);
        // Assume 20% profit margin from events
        const profit = revenue * 0.2;
        
        if (monthIndex !== -1) {
          monthlyRevenue[monthIndex] += revenue;
          totalRevenue += revenue;
          totalProfit += profit;
        }
      }
    });

    // Calculate fund contributions
    funds.forEach(fund => {
      if (!fund.deleted) {
        const fundDate = new Date(fund.deadline);
        const monthIndex = months.findIndex(
          m => m[0] === fundDate.toLocaleString('default', { month: 'short' })
        );
        
        if (monthIndex !== -1) {
          monthlyRevenue[monthIndex] += fund.raisedAmount;
          totalRevenue += fund.raisedAmount;
          // Assume 15% operational costs for funds
          totalProfit += fund.raisedAmount * 0.15;
        }
      }
    });

    return {
      months,
      monthlyRevenue,
      totalRevenue,
      totalProfit
    };
  };

  const { months, monthlyRevenue, totalRevenue, totalProfit } = calculateMonthlyStats();

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  // Chart configuration
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: monthlyRevenue.map((value, index) => 
      index === monthlyRevenue.length - 1 ? primary : primarylight
    ),
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (value) => formatCurrency(value)
      }
    },
  };

  const seriescolumnchart = [
    {
      name: 'Revenue',
      data: monthlyRevenue,
    },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonEmployeeSalaryCard />
      ) : (
        <DashboardWidgetCard
          title="Revenue Statistics"
          subtitle="Monthly Overview"
          dataLabel1="Total Revenue"
          dataItem1={formatCurrency(totalRevenue)}
          dataLabel2="Profit"
          dataItem2={formatCurrency(totalProfit)}
        >
          <>
            <Box height="295px">
              <Chart 
                options={optionscolumnchart} 
                series={seriescolumnchart} 
                type="bar" 
                height={280} 
                width={"100%"} 
              />
            </Box>
          </>
        </DashboardWidgetCard>
      )}
    </>
  );
};

export default RevenueStats;
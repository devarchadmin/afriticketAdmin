"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { 
  Box, 
  CardContent, 
  Grid, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button 
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';

import { fetchEvents } from '@/store/apps/events/EventsSlice';
import { fetchFunds } from '@/store/apps/fund/FundSlice';
import { fetchOrganizations } from '@/store/apps/organization/OrganizationSlice';
import { fetchClients } from '@/store/apps/client/ClientSlice';

const TopCards = () => {
  const dispatch = useDispatch();
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [platformSettings, setPlatformSettings] = useState({
    ticketCommissionPercentage: 5,
    fundraiserCommissionPercentage: 3
  });
  
  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchFunds());
    dispatch(fetchOrganizations());
    dispatch(fetchClients());
  }, [dispatch]);

  // Get data from Redux store
  const events = useSelector(state => state.eventReducer?.events || []);
  const funds = useSelector(state => state.fundReducer?.funds || []);
  const organizations = useSelector(state => state.organizationReducer?.organizations || []);
  const clients = useSelector(state => state.clientReducer?.clients || []);
  
  // Calculate statistics for last month
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  
  const lastMonthEvents = events.filter(event => 
    new Date(event.Date) >= lastMonth && new Date(event.Date) < currentDate
  );

  const lastMonthFunds = funds.filter(fund => 
    new Date(fund.deadline) >= lastMonth && new Date(fund.deadline) < currentDate
  );

  const stats = {
    totalTicketsSoldLastMonth: lastMonthEvents.reduce(
      (sum, event) => sum + parseInt(event.numberOfTickets), 0
    ),
    totalFundsCollectedLastMonth: lastMonthFunds.reduce(
      (sum, fund) => sum + fund.raisedAmount, 0
    ),
    totalEvents: events.filter(e => !e.deleted).length,
    totalOrganizations: organizations.length,
    totalClients: clients.length,
    totalRevenue: events.reduce((sum, event) => {
      const soldTickets = parseInt(event.numberOfTickets) || 0;
      return sum + (soldTickets * parseFloat(event.ticketPrice || 0));
    }, 0) + funds.reduce((sum, fund) => sum + (fund.raisedAmount || 0), 0)
  };

  const topcards = [
    {
      icon: '/images/svgs/icon-user-male.svg',
      title: "Billets vendus (mois dernier)",
      value: stats.totalTicketsSoldLastMonth,
      type: 'count',
      bgcolor: "primary",
    },
    {
      icon: '/images/svgs/icon-briefcase.svg',
      title: "Fonds collectés (mois dernier)",
      value: stats.totalFundsCollectedLastMonth,
      type: 'money',
      bgcolor: "warning",
    },
    {
      icon: '/images/svgs/icon-mailbox.svg',
      title: "Nombre d'événements",
      value: stats.totalEvents,
      type: 'count',
      bgcolor: "secondary",
    },
    {
      icon: '/images/svgs/icon-favorites.svg',
      title: "Organisations enregistrées",
      value: stats.totalOrganizations,
      type: 'count',
      bgcolor: "error",
    },
    {
      icon: '/images/svgs/icon-speech-bubble.svg',
      title: "Nombre de clients",
      value: stats.totalClients,
      type: 'count',
      bgcolor: "success",
    },
    {
      icon: '/images/svgs/icon-connect.svg',
      title: "Revenu total",
      value: stats.totalRevenue,
      type: 'money',
      bgcolor: "info",
    },
  ];

  // Format numbers
  const formatNumber = (value, type) => {
    if (type === 'money') {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M GF';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K GF';
      }
      return value.toFixed(0) + ' GF';
    }
    
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  const handleOpenSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettings = () => {
    setOpenSettingsDialog(false);
  };

  const handleSaveSettings = () => {
    // In a real app, you would dispatch an action to save these settings
    console.log('Saving platform settings', platformSettings);
    handleCloseSettings();
  };

  return (
    <>
      <Grid container spacing={3}>
        {topcards.map((card, i) => (
          <Grid item xs={12} sm={4} lg={2} key={i}>
            <Box bgcolor={card.bgcolor + ".light"} textAlign="center">
              <CardContent>
                <Image 
                  src={card.icon} 
                  alt={card.title} 
                  width="50" 
                  height="50"
                />
                <Typography
                  color={card.bgcolor + ".main"}
                  mt={1}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {card.title}
                </Typography>
                <Typography
                  color={card.bgcolor + ".main"}
                  variant="h4"
                  fontWeight={600}
                >
                  {formatNumber(card.value, card.type)}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
        ))}
        {/* <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenSettings}
          >
            Modifier les paramètres de commission
          </Button>
        </Grid> */}
      </Grid>

      {/* Platform Settings Dialog */}
      {/* <Dialog open={openSettingsDialog} onClose={handleCloseSettings}>
        <DialogTitle>Paramètres de la plateforme</DialogTitle>
        <DialogContent>
          <TextField
            label="Commission sur les billets (%)"
            type="number"
            fullWidth
            value={platformSettings.ticketCommissionPercentage}
            onChange={(e) => setPlatformSettings(prev => ({
              ...prev, 
              ticketCommissionPercentage: parseFloat(e.target.value)
            }))}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Commission sur les collectes de fonds (%)"
            type="number"
            fullWidth
            value={platformSettings.fundraiserCommissionPercentage}
            onChange={(e) => setPlatformSettings(prev => ({
              ...prev, 
              fundraiserCommissionPercentage: parseFloat(e.target.value)
            }))}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveSettings}
            >
              Enregistrer
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleCloseSettings}
            >
              Annuler
            </Button>
          </Box>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default TopCards;
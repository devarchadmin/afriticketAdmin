'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { setVisibilityFilter } from '@/store/apps/client/ClientSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const ClientFilter = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clientReducer?.clients || []);
  
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'Active').length;
  const inactiveClients = clients.filter(client => client.status === 'Inactive').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('all_clients'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{totalClients}</Typography>
          <Typography variant="h6">Total des clients</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('active_clients'))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{activeClients}</Typography>
          <Typography variant="h6">Clients actifs</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('inactive_clients'))}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{inactiveClients}</Typography>
          <Typography variant="h6">Clients inactifs</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default ClientFilter;
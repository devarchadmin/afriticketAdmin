'use client'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from '@/store/apps/fund/FundSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const FundsFilter = () => {
  const dispatch = useDispatch();
  const funds = useSelector((state) => state.fundReducer?.funds || []);
  
  const totalFunds = funds.filter(f => !f.deleted).length;
  const activeFunds = funds.filter(f => !f.deleted && f.status === 'active').length;
  const completedFunds = funds.filter(f => !f.deleted && f.status === 'completed').length;
  const totalRaised = funds
    .filter(f => !f.deleted)
    .reduce((sum, fund) => sum + Number(fund.raisedAmount), 0);

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('all_funds'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{totalFunds}</Typography>
          <Typography variant="h6">Fonds totaux</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('active_funds'))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{activeFunds}</Typography>
          <Typography variant="h6">Fonds actifs</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('completed_funds'))}
          sx={{ backgroundColor: 'error.light', color: 'error.main' }}
        >
          <Typography variant="h3">{completedFunds}</Typography>
          <Typography variant="h6">Fonds terminés</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{totalRaised.toLocaleString()} GF</Typography>
          <Typography variant="h6">Total collecté</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default FundsFilter;
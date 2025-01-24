'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

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
  const funds = useSelector((state) => state.fundsReducer?.pendingFunds || []);

  const totalFunds = funds.length;
  const activeFunds = funds.filter(fund => fund.status === 'active').length;
  const completedFunds = funds.filter(fund => fund.status === 'completed').length;
  const totalCollected = funds.reduce((sum, fund) => {
    if (fund.status === 'completed' || fund.status === 'active') {
      return sum + (fund.currentAmount || 0);
    }
    return sum;
  }, 0);

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={3}>
        <BoxStyled sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}>
          <Typography variant="h3">{totalFunds}</Typography>
          <Typography variant="h6">Fonds totaux</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={3}>
        <BoxStyled sx={{ backgroundColor: 'success.light', color: 'success.main' }}>
          <Typography variant="h3">{activeFunds}</Typography>
          <Typography variant="h6">Fonds actifs</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={3}>
        <BoxStyled sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}>
          <Typography variant="h3">{completedFunds}</Typography>
          <Typography variant="h6">Fonds terminés</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={3}>
        <BoxStyled sx={{ backgroundColor: 'info.light', color: 'info.main' }}>
          <Typography variant="h3">{totalCollected.toLocaleString()} GF</Typography>
          <Typography variant="h6">Total collecté</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default FundsFilter;

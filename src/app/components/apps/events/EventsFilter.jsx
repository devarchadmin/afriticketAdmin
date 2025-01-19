'use client'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from '@/store/apps/events/EventsSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const EventsFilter = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.eventReducer?.events || []);
  
  const totalEvents = events.filter(e => !e.deleted).length;
  const activeEvents = events.filter(e => !e.deleted && e.status === 'active').length;
  const completedEvents = events.filter(e => !e.deleted && e.status === 'completed').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('total_events'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{totalEvents}</Typography>
          <Typography variant="h6">Total des événements</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('active_events'))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{activeEvents}</Typography>
          <Typography variant="h6">Événements actifs</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('completed_events'))}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{completedEvents}</Typography>
          <Typography variant="h6">Événements terminés</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default EventsFilter;
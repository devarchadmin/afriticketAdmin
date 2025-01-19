'use client'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from '@/store/apps/organization/OrganizationSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const OrganizationFilter = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.organizationReducer?.organizations || []);
  
  const totalOrganizations = organizations.length;
  const pendingOrganizations = organizations.filter(org => org.status === 'pending').length;
  const verifiedOrganizations = organizations.filter(org => org.status === 'verified').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('all_organizations'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{totalOrganizations}</Typography>
          <Typography variant="h6">Total des organisations</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('pending_verification'))}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{pendingOrganizations}</Typography>
          <Typography variant="h6">Organisations en attente</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('verified_organizations'))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{verifiedOrganizations}</Typography>
          <Typography variant="h6">Organisations vérifiées</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default OrganizationFilter;
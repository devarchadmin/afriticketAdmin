'use client'
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { getOrganizations, formatOrganizationData } from '@/app/api/organizations/OrganizationData';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const OrganizationFilter = ({ onFilterChange }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        const formattedData = formatOrganizationData(data.data);
        setOrganizations(formattedData);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const totalOrganizations = organizations.length;
  const pendingOrganizations = organizations.filter(org => !['approved', 'rejected'].includes(org.status)).length;
  const verifiedOrganizations = organizations.filter(org => org.status === 'approved').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => onFilterChange('all')}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{loading ? '...' : totalOrganizations}</Typography>
          <Typography variant="h6">Total des organisations</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => onFilterChange('pending')}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{loading ? '...' : pendingOrganizations}</Typography>
          <Typography variant="h6">Organisations en attente</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={4}>
        <BoxStyled
          onClick={() => onFilterChange('approved')}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{loading ? '...' : verifiedOrganizations}</Typography>
          <Typography variant="h6">Organisations vérifiées</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default OrganizationFilter;
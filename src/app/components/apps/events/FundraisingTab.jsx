'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import { fetchAllFundraisings } from '@/store/apps/funds/FundsSlice';

const FundraisingTab = ({ organizationId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('FundraisingTab mounted with organizationId:', organizationId);
    if (organizationId) {
      dispatch(fetchAllFundraisings())
        .then(() => setError(null))
        .catch(err => {
          console.error('Error fetching fundraisings:', err);
          setError('Failed to load fundraising campaigns');
        })
        .finally(() => setIsLoading(false));
    } else {
      console.warn('No organization ID provided');
      setIsLoading(false);
    }
  }, [dispatch, organizationId]);

  const fundraisings = useSelector((state) => {
    const allFunds = state.fundsReducer.allFunds || [];
    console.log('All funds:', allFunds);
    const parsedOrgId = parseInt(organizationId);
    console.log('Filtering for organization ID:', parsedOrgId);
    const filtered = allFunds.filter(fund => fund.organization?.id === parsedOrgId);
    console.log('Filtered fundraisings:', filtered);
    return filtered;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  if (!organizationId) {
    return (
      <Box p={3}>
        <Typography color="error">Organization ID is required to display fundraising campaigns</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!fundraisings.length) {
    return (
      <Box p={3}>
        <Typography>No fundraising campaigns found for this organization</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {fundraisings.map((fundraising) => (
        <Grid item xs={12} key={fundraising.id}>
          <Card>
            <CardContent>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {fundraising.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={fundraising.status} 
                      color={getStatusColor(fundraising.status)}
                      size="small"
                    />
                    <Chip 
                      label={fundraising.category} 
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="subtitle2" color="text.secondary">
                    Created: {format(new Date(fundraising.created_at), 'MMM d, yyyy')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {format(new Date(fundraising.updated_at), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Typography variant="body1" paragraph>
                {fundraising.description}
              </Typography>

              {/* Progress and Stats */}
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1">
                    Progress: {fundraising.stats.progressPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle1">
                    {fundraising.stats.totalRaised.toLocaleString()} GF / {fundraising.goal.toLocaleString()} GF
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(fundraising.stats.progressPercentage, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                {/* Key Stats */}
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Donors
                    </Typography>
                    <Typography variant="h6">
                      {fundraising.stats.totalDonors}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Donation
                    </Typography>
                    <Typography variant="h6">
                      {fundraising.stats.averageDonation.toLocaleString()} GF
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Remaining Goal
                    </Typography>
                    <Typography variant="h6">
                      {fundraising.stats.remainingAmount.toLocaleString()} GF
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Recent Donations */}
              {fundraising.donations?.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>Recent Donations</Typography>
                  <Grid container spacing={2}>
                    {fundraising.donations.slice(0, 3).map((donation) => (
                      <Grid item xs={12} sm={4} key={donation.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Anonymous Donor
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {parseFloat(donation.amount).toLocaleString()} GF
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {format(new Date(donation.created_at), 'MMM d, yyyy h:mm a')}
                            </Typography>
                            <Chip 
                              label={donation.payment_status}
                              color={donation.payment_status === 'completed' ? 'success' : 'warning'}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FundraisingTab;

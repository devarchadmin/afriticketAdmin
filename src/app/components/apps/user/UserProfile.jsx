'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, CircularProgress, Button, Grid, Paper } from '@mui/material';
import axiosServices from '@/utils/axios'; // Ensure you have axios set up for API calls

// Mock data for missing fields
const mockData = {
  location: 'New York, USA',
  bio: 'Passionate about creating amazing user experiences and building great software.',
  joined_date: '2024',
  social_links: {
    twitter: 'https://twitter.com/username',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username'
  },
  total_events: 0,
  total_tickets_sold: 0,
  total_revenue: 0
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosServices.get('/user');
        if (response.data.status === 'success') {
          // Combine API data with mock data
          setUser({
            ...mockData,
            ...response.data.data,
            // Format dates
            created_at: new Date(response.data.data.created_at).toLocaleDateString(),
            updated_at: new Date(response.data.data.updated_at).toLocaleDateString(),
          });
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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

  return (
    <Box p={3}>
      <Paper elevation={0}>
        <Box p={3}>
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Avatar 
                  src={user.profile_image ? `https://api.afrikticket.com/storage/${user.profile_image}` : '/images/profile/user-default.jpg'} 
                  sx={{ width: 120, height: 120 }}
                />
                <Box ml={3}>
                  <Typography variant="h4">{user.name}</Typography>
                  <Typography variant="body1" color="textSecondary">{user.role}</Typography>
                  <Typography variant="body2" color="textSecondary">Member since {user.created_at}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* User Details */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {user.phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Location:</strong> {user.location}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>About</Typography>
                <Typography variant="body1">{user.bio}</Typography>
              </Box>
            </Grid>

            {/* Stats and Additional Info */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Account Details</Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {user.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Account ID:</strong> {user.id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Last Updated:</strong> {user.updated_at}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Statistics</Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Total Events:</strong> {user.total_events}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Tickets Sold:</strong> {user.total_tickets_sold}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Total Revenue:</strong> ${user.total_revenue}
                </Typography>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button variant="contained" color="primary">
                  Edit Profile
                </Button>
                <Button variant="outlined" color="primary">
                  Change Password
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile; 
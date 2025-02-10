'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import axiosServices from '@/utils/axios';

const EventsTab = ({ organizationId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosServices.get('/events');
        const organizationEvents = response.data.data.filter(
          event => event.organization.id === parseInt(organizationId)
        );
        setEvents(organizationEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchEvents();
    }
  }, [organizationId]);

  if (loading) {
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

  if (!events.length) {
    return (
      <Box p={3}>
        <Typography>Aucun événement trouvé pour cette organisation</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} key={event.id}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <img
                    src={`https://api.afrikticket.com/storage/${event.image}`}
                    alt={event.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {event.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={event.category}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date et heure
                      </Typography>
                      <Typography>
                        {format(new Date(event.start_date), 'dd MMM yyyy HH:mm')} -
                        {format(new Date(event.end_date), 'HH:mm')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Lieu
                      </Typography>
                      <Typography>{event.location}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Prix
                      </Typography>
                      <Typography>{parseFloat(event.price).toLocaleString()} GF</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Billets restants
                      </Typography>
                      <Typography>{event.remaining_tickets}</Typography>
                    </Grid>
                  </Grid>

                  <Box mt={2}>
                    <Button 
                      variant="contained" 
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      Voir les détails
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventsTab;
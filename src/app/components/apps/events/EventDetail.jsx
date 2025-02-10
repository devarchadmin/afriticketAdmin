'use client'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconDownload } from '@tabler/icons-react';
import { useTheme, useMediaQuery } from '@mui/material';
import axiosServices from '@/utils/axios';
import CircularProgress from '@mui/material/CircularProgress';

const sampleTicketPurchases = [
  {
    id: 1,
    purchaseDate: new Date('2024-01-15'),
    buyerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    ticketCount: 2,
    totalAmount: 300,
    paymentStatus: "Paid",
    avatar: "/images/profile/user-default.jpg"
  },
  {
    id: 2,
    purchaseDate: new Date('2024-01-16'),
    buyerName: "Sarah Smith",
    email: "sarah.smith@example.com",
    phone: "+1 (555) 234-5678",
    ticketCount: 4,
    totalAmount: 600,
    paymentStatus: "Paid",
    avatar: "/images/profile/user-2.jpg"
  }
];

const EventDetail = ({ params }) => {
  const router = useRouter();
  const eventId = parseInt(params.id);
  const event = useSelector((state) =>
    state.eventReducer.events.find(e => e.Id === eventId)
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosServices.get(`/admin/events/${eventId}/users`);
        setEventDetails(response.data.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !eventDetails) {
    return (
      <Box p={3}>
        <Typography>{error || 'Événement introuvable'}</Typography>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Box>
    );
  }

  const { event: eventData, stats, ticket_buyers } = eventDetails;
  
  // Create a merged event object with mock data for missing fields
  const enrichedEvent = {
    Id: eventData.id,
    ticketTitle: eventData.title,
    ticketDescription: eventData.description,
    location: eventData.location,
    Date: new Date(eventData.date),
    duration: eventData.duration || '2', // Mock duration if missing
    numberOfTickets: eventData.max_tickets || 100, // Mock max tickets if missing
    ticketPrice: parseFloat(eventData.price),
    status: eventData.status || 'active',
    images: eventData.main_image ? 
      [`https://api.afrikticket.com/storage/${eventData.main_image}`] : 
      ['/images/events/default-event.jpg'],
    organization: {
      name: eventData.organization?.name || 'Organization Name',
      logo: eventData.organization?.logo ? 
        `https://api.afrikticket.com/storage/${eventData.organization.logo}` : 
        '/images/organizations/default.jpg',
      email: eventData.organization?.email || '',
      phone: eventData.organization?.phone || ''
    }
  };
  
  const totalTicketsSold = stats.total_tickets_sold;
  const totalRevenue = stats.total_revenue;
  const ticketsRemaining = enrichedEvent.numberOfTickets - totalTicketsSold;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? enrichedEvent.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === enrichedEvent.images.length - 1 ? 0 : prev + 1
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const getEventStatusChip = () => (
    <Chip
      label={enrichedEvent.status === 'active' ? 'Active' : 'Completed'}
      color={enrichedEvent.status === 'active' ? 'success' : 'error'}
      size="small"
    />
  );

  return (
    <Box p={3} sx={{ p: 0 }}>
      <Button
        startIcon={<IconArrowLeft />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Dos
      </Button>

      {/* Event Image and Navigation */}
      <Card sx={{ mb: 3, width: "100%" }}>
        <Box
          sx={{
            position: 'relative',
            height: 400,
            backgroundColor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {enrichedEvent.images && enrichedEvent.images.length > 0 && (
            <>
              <img
                src={enrichedEvent.images[currentImageIndex]}
                alt={enrichedEvent.ticketTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {enrichedEvent.images.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      left: 8,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={handlePrevImage}
                  >
                    <IconChevronLeft />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={handleNextImage}
                  >
                    <IconChevronRight />
                  </IconButton>
                </>
              )}
            </>
          )}
        </Box>
      </Card>

      {/* Event Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={enrichedEvent.organization.logo}
                  sx={{ width: 50, height: 50 }}
                />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {enrichedEvent.organization.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h3">
                      {enrichedEvent.ticketTitle}
                    </Typography>
                    {getEventStatusChip()}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Event Description */}
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                {enrichedEvent.ticketDescription}
              </Typography>
            </Grid>

            {/* Event Date, Location, Duration */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Date et heure
                </Typography>
                <Typography variant="body1">
                  {format(new Date(enrichedEvent.Date), 'EEEE, MMMM d, yyyy h:mm a')}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Emplacement
                </Typography>
                <Typography variant="body1">
                  {enrichedEvent.location}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Duration
                </Typography>
                <Typography variant="body1">
                  {enrichedEvent.duration} heures
                </Typography>
              </Box>
            </Grid>

            {/* Event Ticket Price, Remaining Tickets, Organization */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Prix ​​du billet
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {parseFloat(enrichedEvent.ticketPrice).toFixed(2)} GF
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Billets restants
                </Typography>
                <Typography variant="h4">
                  {ticketsRemaining.toLocaleString()}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Organisation
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={enrichedEvent.organization.logo}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body1">
                    {enrichedEvent.organization.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sales Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {totalTicketsSold}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Billets vendus
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {totalRevenue.toLocaleString()} GF
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Revenu total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {ticketsRemaining}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Billets restants
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ticket Purchases */}
      <Card>
        <CardContent>
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'flex-start' : 'center'}
            mb={3}
            gap={isMobile ? 2 : 0}
          >
            <Typography variant="h5" component="div" sx={{ mb: isMobile ? 2 : 0 }}>
              Achats de billets ({stats.unique_buyers} acheteurs)
            </Typography>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems="center"
              gap={2}
            >
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                onClick={() => {/* Add export functionality */}}
                sx={{ alignSelf: isMobile ? 'start' : 'center' }}
              >
                Exporter des données
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>Acheteur</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Contact</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Billets</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Montant total</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Statut</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticket_buyers.map((buyer) => (
                  <TableRow key={buyer.user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={buyer.user.profile_image ? `https://api.afrikticket.com/storage/${buyer.user.profile_image}` : null}
                          sx={{ mr: 2 }}
                        >
                          {buyer.user.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {buyer.user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{buyer.user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {buyer.user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>{buyer.tickets_purchased}</TableCell>
                    <TableCell>{buyer.total_spent} GF</TableCell>
                    <TableCell>
                      <Chip
                        label={buyer.user.status}
                        color={getStatusColor(buyer.user.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetail;
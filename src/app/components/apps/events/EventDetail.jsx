'use client'
import React, { useState } from 'react';
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
    avatar: "/images/profile/user-1.jpg"
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

  if (!event) {
    return (
      <Box p={3}>
        <Typography>Événement introuvable</Typography>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Box>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? event.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === event.images.length - 1 ? 0 : prev + 1
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
      label={event.status === 'active' ? 'Active' : 'Completed'}
      color={event.status === 'active' ? 'success' : 'error'}
      size="small"
    />
  );

  const totalTicketsSold = sampleTicketPurchases.reduce((sum, purchase) => sum + purchase.ticketCount, 0);
  const totalRevenue = sampleTicketPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const ticketsRemaining = parseInt(event.numberOfTickets) - totalTicketsSold;

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
          {event.images && event.images.length > 0 && (
            <>
              <img
                src={event.images[currentImageIndex]}
                alt={event.ticketTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {event.images.length > 1 && (
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
                  src={event.organization?.logo}
                  sx={{ width: 50, height: 50 }}
                />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {event.organization?.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h3">
                      {event.ticketTitle}
                    </Typography>
                    {getEventStatusChip()}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Event Description */}
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                {event.ticketDescription}
              </Typography>
            </Grid>

            {/* Event Date, Location, Duration */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Date et heure
                </Typography>
                <Typography variant="body1">
                  {format(new Date(event.Date), 'EEEE, MMMM d, yyyy h:mm a')}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Emplacement
                </Typography>
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                  Duration
                </Typography>
                <Typography variant="body1">
                  {event.duration} heures
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
                  {parseFloat(event.ticketPrice).toFixed(2)} GF
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
                    src={event.organization?.logo}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body1">
                    {event.organization?.name}
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
              Achats de billets
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
                onClick={() => {/* Add export functionality */ }}
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
                  <TableCell><Typography fontWeight={600}>Date d'achat</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Contact</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Billets</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Montant total</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Statut</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleTicketPurchases.map((purchase) => (
                  <TableRow key={purchase.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={purchase.avatar} sx={{ mr: 2 }} />
                        <Typography variant="subtitle2">
                          {purchase.buyerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(purchase.purchaseDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{purchase.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {purchase.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>{purchase.ticketCount}</TableCell>
                    <TableCell>{purchase.totalAmount} GF</TableCell>
                    <TableCell>
                      <Chip
                        label={purchase.paymentStatus}
                        color={getStatusColor(purchase.paymentStatus)}
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

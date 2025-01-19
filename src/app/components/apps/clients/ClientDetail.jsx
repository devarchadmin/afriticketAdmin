'use client'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IconArrowLeft, IconWorld, IconMail, IconPhone } from '@tabler/icons-react';

const ClientDetail = ({ params }) => {
  const router = useRouter();
  const clientId = parseInt(params.id);
  const [activeTab, setActiveTab] = useState(0);

  const client = useSelector((state) =>
    state.clientReducer.clients.find(c => c.id === clientId)
  );

  if (!client) {
    return (
      <Box p={3}>
        <Typography>Client non trouvé</Typography>
        <Button onClick={() => router.back()}>Retour</Button>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Refunded': return 'error';
      default: return 'default';
    }
  };

  const totalPurchases = client.purchaseHistory.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalDonations = client.donationHistory.reduce((sum, donation) => sum + donation.amount, 0);
  const outstandingAmount = totalPurchases - client.purchaseHistory.filter(p => p.paymentStatus === 'Paid').reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderPurchaseHistory = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Événement</TableCell>
            <TableCell>Date d'achat</TableCell>
            <TableCell>Nombre de billets</TableCell>
            <TableCell>Montant total</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {client.purchaseHistory.map((purchase) => (
            <TableRow key={purchase.id} hover>
              <TableCell>{purchase.eventTitle}</TableCell>
              <TableCell>
                {format(new Date(purchase.purchaseDate), 'dd MMM yyyy')}
              </TableCell>
              <TableCell>{purchase.ticketCount}</TableCell>
              <TableCell>{purchase.totalAmount.toLocaleString()} GF</TableCell>
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
  );

  const renderDonationHistory = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Collecte de fonds</TableCell>
            <TableCell>Date de don</TableCell>
            <TableCell>Montant</TableCell>
            {/* <TableCell>Statut</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {client.donationHistory.map((donation) => (
            <TableRow key={donation.id} hover>
              <TableCell>{donation.fundraiserTitle}</TableCell>
              <TableCell>
                {format(new Date(donation.donationDate), 'dd MMM yyyy')}
              </TableCell>
              <TableCell>{donation.amount.toLocaleString()} GF</TableCell>
              <TableCell>
                <Chip
                  label={donation.paymentStatus}
                  color={getStatusColor(donation.paymentStatus)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box p={3}>
      <Button
        startIcon={<IconArrowLeft />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Retour à la liste des clients
      </Button>

      <Grid container spacing={3}>
        {/* Client Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={client.avatar}
                  sx={{ width: 100, height: 100 }}
                />
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h4">
                      {client.firstName} {client.lastName}
                    </Typography>
                    <Chip
                      label={client.status}
                      color={client.status === 'Active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {client.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" mb={3}>Informations de contact</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconMail />
                  <Typography>{client.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconPhone />
                  <Typography>{client.phoneNumber}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconWorld />
                  <Typography>{client.location.city}, {client.location.country}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" mb={3}>Résumé financier</Typography>
              <Grid container spacing={3} textAlign="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="primary.main">
                    {totalPurchases.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total des achats
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="primary.main">
                    {totalDonations.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total des dons
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="warning.main">
                    {outstandingAmount.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Montant en attente
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase and Donation History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ mb: 3 }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Historique des achats" />
                  <Tab label="Historique des dons" />
                </Tabs>
              </Box>

              {activeTab === 0 && renderPurchaseHistory()}
              {activeTab === 1 && renderDonationHistory()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetail;
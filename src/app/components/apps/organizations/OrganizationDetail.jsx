'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
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
import { isMobile } from 'react-device-detect';
import {
  IconArrowLeft,
  IconWorldWww,
  IconMail,
  IconPhone
} from '@tabler/icons-react';
import {
  setSelectedOrganization,
} from '@/store/apps/organization/OrganizationSlice';
import { getOrganization } from '@/app/api/organizations/OrganizationData';
import CircularProgress from '@mui/material/CircularProgress';

// Payment History Tab Component
const PaymentHistoryTab = ({ organizationId }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: new Date('2024-01-15'),
      type: 'income',
      description: 'Vente de billets - Gala du Nouvel An',
      amount: 45000,
      paymentMethod: 'Virement bancaire',
      status: 'Terminé'
    },
    {
      id: 2,
      date: new Date('2024-02-20'),
      type: 'expense',
      description: 'Achat d\'équipement',
      amount: 15000,
      paymentMethod: 'Espèces',
      status: 'Terminé'
    },
    {
      id: 3,
      date: new Date('2024-03-10'),
      type: 'income',
      description: 'Don de collecte de fonds',
      amount: 75000,
      paymentMethod: 'Paiement en ligne',
      status: 'Terminé'
    }
  ]);

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    startDate: null,
    endDate: null
  });

  const filteredTransactions = transactions
    .filter(transaction => {
      const typeMatch = filters.type === 'all' || transaction.type === filters.type;
      const statusMatch = filters.status === 'all' || transaction.status === filters.status;
      return typeMatch && statusMatch;
    })
    .sort((a, b) => b.date - a.date);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const getTransactionColor = (type) => {
    return type === 'income' ? 'success' : 'error';
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" mr={2}>
            Total Revenus: {totalIncome.toLocaleString()} GF
          </Typography>
          <Typography variant="subtitle1">
            Total Dépenses: {totalExpenses.toLocaleString()} GF
          </Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Méthode de Paiement</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>
                  {format(transaction.date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                    color={getTransactionColor(transaction.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <Typography
                    color={getTransactionColor(transaction.type)}
                    variant="body2"
                  >
                    {transaction.amount.toLocaleString()} GF
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={transaction.status === 'Terminé' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const OrganizationDetail = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const organizationId = parseInt(params.id);
  const [activeTab, setActiveTab] = useState(0);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from Redux store
  const events = useSelector((state) =>
    state.eventReducer.events.filter(event => event.organizationId === organizationId)
  );

  // Sample fundraisers (you might want to replace this with actual data from your backend)
  const fundraisers = [
    {
      id: 1,
      title: "Initiative de Santé",
      description: "Collecte de fonds pour équipement médical",
      targetAmount: 100000,
      raisedAmount: 75000,
      status: "Actif",
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30')
    },
    {
      id: 2,
      title: "Programme de Soutien à l'Éducation",
      description: "Soutenir les étudiants défavorisés",
      targetAmount: 50000,
      raisedAmount: 35000,
      status: "En Cours",
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15')
    }
  ];

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true);
        const data = await getOrganization(organizationId);
        setOrganization(data);
        dispatch(setSelectedOrganization(organizationId));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationData();
    }
  }, [dispatch, organizationId]);

  if (loading) {
    return (
      <Box p={3}>
        <Button
          startIcon={<IconArrowLeft />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Retour aux organisations
        </Button>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Button
          startIcon={<IconArrowLeft />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Retour aux organisations
        </Button>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box p={3}>
        <Button
          startIcon={<IconArrowLeft />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Retour aux organisations
        </Button>
        <Typography variant="h6">Organisation non trouvée</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  // For now, using sample values since we don't have the metrics data
  const totalRaised = 0;
  const expectedAmount = 0;

  const renderEvents = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Titre de l'événement</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Lieu</TableCell>
            <TableCell>Billets vendus</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.Id} hover>
              <TableCell>{event.ticketTitle}</TableCell>
              <TableCell>{format(new Date(event.Date), 'dd MMM yyyy')}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.numberOfTickets}</TableCell>
              <TableCell>
                <Chip
                  label={event.status}
                  color={event.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderFundraisers = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Titre de la collecte de fonds</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Montant cible</TableCell>
            <TableCell>Montant collecté</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Période</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fundraisers.map((fundraiser) => (
            <TableRow key={fundraiser.id} hover>
              <TableCell>{fundraiser.title}</TableCell>
              <TableCell>{fundraiser.description}</TableCell>
              <TableCell>{fundraiser.targetAmount.toLocaleString()} GF</TableCell>
              <TableCell>{fundraiser.raisedAmount.toLocaleString()} GF</TableCell>
              <TableCell>
                <Chip
                  label={fundraiser.status}
                  color={fundraiser.status === 'Actif' ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {format(fundraiser.startDate, 'dd MMM yyyy')} -
                {format(fundraiser.endDate, 'dd MMM yyyy')}
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
        Retour aux organisations
      </Button>

      <Grid container spacing={3}>
        {/* Organization Header */}
        <Grid item xs={12}>
          <Card sx={{ p: 0 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>

                <Box display={"flex"} flexDirection={"column"}>
                  <Avatar
                    src={organization.logo}
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  />
                  {isMobile ? <Chip
                    label={organization.status}
                    color={getStatusColor(organization.status)}
                    size="small"
                    sx={{ mt: 2 }}
                  /> : <></>}
                </Box>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h4">{organization.name}</Typography>

                  </Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {organization.description}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" mb={3}>Métriques financières</Typography>
              <Grid container spacing={3} textAlign="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="primary.main">
                    {totalRaised.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total collecté
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="primary.main">
                    {expectedAmount.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Montant attendu
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h4"
                    color={organization.status === 'approved' ? 'success.main' : 'warning.main'}
                  >
                    {organization.status}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Statut de l'organisation
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Events and Fundraisers Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 3 }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Événements" />
                  <Tab label="Collectes de fonds" />
                  <Tab label="Historique des Paiements" />
                </Tabs>
              </Box>

              {activeTab === 0 && renderEvents()}
              {activeTab === 1 && renderFundraisers()}
              {activeTab === 2 && <PaymentHistoryTab organizationId={organizationId} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationDetail;
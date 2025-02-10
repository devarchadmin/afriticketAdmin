'use client'
import React, { useEffect, useState, useMemo } from 'react';
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
  IconPhone,
  IconFileAnalytics
} from '@tabler/icons-react';
import {
  setSelectedOrganization,
} from '@/store/apps/organization/OrganizationSlice';
import { getOrganization } from '@/app/api/organizations/OrganizationData';
import CircularProgress from '@mui/material/CircularProgress';
import axiosServices from '@/utils/axios';
import EventsTab from './EventsTab';
import FundraisingTab from '../events/FundraisingTab';

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
  const [documents, setDocuments] = useState(null);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Get fundraising data from Redux store
  const fundraisings = useSelector((state) => {
    const allFunds = state.fundsReducer.allFunds || [];
    const parsedOrgId = parseInt(organizationId);
    return allFunds.filter(fund => fund.organization?.id === parsedOrgId);
  });

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    return fundraisings.reduce((metrics, fund) => {
      metrics.totalRaised += fund.raisedAmount || 0;
      metrics.expectedAmount += fund.requestedAmount || 0;
      return metrics;
    }, {
      totalRaised: 0,
      expectedAmount: 0
    });
  }, [fundraisings]);

  // Fetch events for organization
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await axiosServices.get('https://api.afrikticket.com/api/events');
        const organizationEvents = response.data.data.filter(
          event => event.organization.id === organizationId
        );
        setEvents(organizationEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (organizationId) {
      fetchEvents();
    }
  }, [organizationId]);

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

  // Fetch organization data
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

  // Fetch documents if organization is pending
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (organization?.status === 'pending') {
          const response = await axiosServices.get('https://api.afrikticket.com/api/admin/pending/orgs');
          const orgDocs = response.data.data.data.find(org => org.id === organizationId);
          setDocuments(orgDocs);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    if (organization) {
      fetchDocuments();
    }
  }, [organization, organizationId]);

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

  const renderEvents = () => (
    loadingEvents ? (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    ) : events.length === 0 ? (
      <Box p={3} textAlign="center">
        <Typography>Aucun événement trouvé pour cette organisation</Typography>
      </Box>
    ) : (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Date & Heure</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Places restantes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                {/* ... existing table row content ... */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  const renderDocuments = () => (
    organization?.status === 'pending' ? (
      documents ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>ICD Document</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    href={`https://api.afrikticket.com/storage/${documents.icd_document}`}
                    target="_blank"
                    startIcon={<IconFileAnalytics size={16} />}
                  >
                    Voir l'ICD
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>Registre de Commerce</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    href={`https://api.afrikticket.com/storage/${documents.commerce_register}`}
                    target="_blank"
                    startIcon={<IconFileAnalytics size={16} />}
                  >
                    Voir le registre
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box p={3} textAlign="center">
          <Typography>Chargement des documents...</Typography>
        </Box>
      )
    ) : (
      <Box p={3} textAlign="center">
        <Typography>Aucun document à afficher pour les organisations non en attente</Typography>
      </Box>
    )
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
                  </Typography> {/* Add closing tag here */}
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
                    {financialMetrics.totalRaised.toLocaleString()} GF
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total collecté
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h4" color="primary.main">
                    {financialMetrics.expectedAmount.toLocaleString()} GF
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
                  <Tab label="Documents"/>
                  <Tab label="Événements" />
                  <Tab label="Collectes de fonds" />
                  <Tab label="Historique des Paiements" />
                </Tabs>
              </Box>
              {activeTab === 0 && renderDocuments()}
              {activeTab === 1 && <EventsTab organizationId={organizationId} />}
              {activeTab === 2 && <FundraisingTab organizationId={organizationId} />}
              {activeTab === 3 && <PaymentHistoryTab organizationId={organizationId} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationDetail;

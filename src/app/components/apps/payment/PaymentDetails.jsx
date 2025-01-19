'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { fetchPayments } from '@/store/apps/payment/PaymentSlice';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { 
  IconArrowBack, 
  IconPrinter, 
  IconReceipt, 
  IconCreditCard, 
  IconCalendar 
} from '@tabler/icons-react';

const PaymentDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [payment, setPayment] = useState(null);

  const payments = useSelector((state) => state.paymentReducer?.payments || []);
  const organizations = useSelector((state) => state.organizationReducer?.organizations || []);

  useEffect(() => {
    if (payments.length === 0) {
      dispatch(fetchPayments());
    }
  }, [dispatch, payments.length]);

  useEffect(() => {
    const selectedPayment = payments.find(p => p.Id === parseInt(params.id));
    setPayment(selectedPayment);
  }, [payments, params.id]);

  if (!payment) {
    return <Typography variant="h6">Chargement des détails du paiement...</Typography>;
  }

  const BCrumb = [
    {
      to: '/',
      title: 'Maison',
    },
    {
      to: '/payment',
      title: 'Paiements',
    },
    {
      title: `Paiements # ${payment.Id}`,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  // Determine the source organization
  const sourceOrganization = organizations.find(org => 
    org.id === (payment.eventId ? payment.eventId : payment.fundId)
  );

  // Determine status color
  const getStatusColor = () => {
    switch (payment.status) {
      case 'Processed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <PageContainer title={`Paiements # ${payment.Id} | AfrikTicket`}>
      <Breadcrumb title={`Paiements # ${payment.Id}`} items={BCrumb} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<IconArrowBack />} 
          onClick={() => router.push('/payment')}
        >
          Retour aux paiements
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<IconPrinter />} 
          onClick={handlePrint}
        >
          Imprimer les détails du paiement
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Payment Information */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <IconReceipt style={{ marginRight: 10 }} />
                <Typography variant="h5">Informations de paiement</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Identifiant de paiement
                  </Typography>
                  <Typography variant="body1">#{payment.Id}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Source
                  </Typography>
                  <Typography variant="body1">
                    {payment.eventId ? 'Événement' : payment.fundId ? 'Collecte de fonds' : 'Inconnu'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Mode de paiement
                  </Typography>
                  <Typography variant="body1">
                    {payment.paymentMethod || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Financial Details */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <IconCreditCard style={{ marginRight: 10 }} />
                <Typography variant="h5">Détails financiers</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Montant total
                  </Typography>
                  <Typography variant="body1">
                    {payment.totalAmount?.toLocaleString() || 'N/A'} GF
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Frais de plateforme
                  </Typography>
                  <Typography variant="body1">
                    {((payment.totalAmount * payment.afriticketPercentage) || 0).toLocaleString()} GF
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Montant net
                  </Typography>
                  <Typography variant="body1">
                    {payment.amountToBeCollected?.toLocaleString() || 'N/A'} GF
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Transaction Details */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <IconCalendar style={{ marginRight: 10 }} />
                <Typography variant="h5">Détails de la transaction</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date de transaction
                  </Typography>
                  <Typography variant="body1">
                    {payment.transactionDate 
                      ? format(new Date(payment.transactionDate), 'dd MMMM yyyy HH:mm') 
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Statut
                  </Typography>
                  <Chip 
                    label={payment.status || 'N/A'}
                    color={getStatusColor()}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Organization Details */}
            {sourceOrganization && (
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Détails de l'organisation
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Nom de l'organisation
                    </Typography>
                    <Typography variant="body1">
                      {sourceOrganization.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Contact
                    </Typography>
                    <Typography variant="body1">
                      {sourceOrganization.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default PaymentDetails;
'use client'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { isMobile } from 'react-device-detect';
import { styled } from '@mui/material/styles';
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconClock,
  IconShare
} from '@tabler/icons-react';
import BlankCard from '@/app/components/shared/BlankCard';

const sampleDonations = [
  {
    id: 1,
    donationDate: new Date('2024-01-15'),
    donorName: "John Doe",
    email: "john.doe@example.com",
    amount: 500,
    message: "Keep up the great work!",
    status: "Completed",
    avatar: "/images/profile/user-1.jpg",
    anonymous: false
  },
  {
    id: 2,
    donationDate: new Date('2024-01-16'),
    donorName: "Anonymous Donor",
    email: "anonymous@example.com",
    amount: 1000,
    message: "Happy to support this cause",
    status: "Completed",
    avatar: "/images/profile/user-2.jpg",
    anonymous: true
  }
];

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '500px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const DetailSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FundDetail = ({ params }) => {
  const router = useRouter();
  const fundId = parseInt(params.id);
  const fund = useSelector((state) =>
    state.fundReducer.funds.find(f => f.Id === fundId)
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!fund) {
    return (
      <Box p={3}>
        <Typography>Fonds introuvable</Typography>
        <Button onClick={() => router.back()}>Retourner</Button>
      </Box>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? fund.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === fund.images.length - 1 ? 0 : prev + 1
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const totalDonors = sampleDonations.length;
  const totalDonations = sampleDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const averageDonation = totalDonations / totalDonors || 0;
  const progress = (totalDonations / fund.requestedAmount) * 100;
  

  return (
    <Box p={3} sx={{ p: 0 }}>
      <Button
        startIcon={<IconArrowLeft />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Dos
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <BlankCard>
            <Box position="relative">
              <StyledImage
                src={fund.images[currentImageIndex]}
                alt={fund.title}
              />
              {fund.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <IconChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <IconChevronRight />
                  </IconButton>
                </>
              )}
            </Box>

            <CardContent>
              <DetailSection>
                <Typography variant="h4" gutterBottom>
                  À propos de ce fonds
                </Typography>
                <Typography variant="body1">
                  {fund.description}
                </Typography>
              </DetailSection>

              <DetailSection>
                <Typography variant="h5" gutterBottom>
                  Bénéficiaire
                </Typography>
                <Typography variant="body1">
                  {fund.beneficiary}
                </Typography>
              </DetailSection>
            </CardContent>
          </BlankCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                { !isMobile ? <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={fund.organization?.logo}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Organisé par
                    </Typography>
                    <Typography variant="subtitle1">
                      {fund.organization?.name}
                    </Typography>
                  </Box>
                </Box> : <></>}
                <Box display="flex" gap={1}>
                  <Chip
                    label={fund.status === 'active' ? 'Actif' : 'Terminé'}
                    color={fund.status === 'active' ? 'success' : 'error'}
                  />
                  <Chip label={fund.category} variant="outlined" />
                </Box>
              </Box>

              <Typography variant="h4" gutterBottom>
                {fund.title}
              </Typography>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Progrès</Typography>
                  <Typography variant="body2">{progress.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {totalDonations.toLocaleString()} GF collecté
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Objectif: {fund.requestedAmount.toLocaleString()} GF
                  </Typography>
                </Box>
              </Box>

              <Box mb={3} display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{totalDonors}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Donateurs
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">
                    {fund.minimumAmount} GF
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Don minimum
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">
                    {averageDonation.toFixed(0)} GF
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Don moyen
                  </Typography>
                </Box>
              </Box>

              <Box mb={3} display="flex" alignItems="center" gap={1}>
                <IconClock size={20} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {fund.status === 'active' ? 'Se termine le' : 'Terminé le'}
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(fund.deadline), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={fund.status !== 'active'}
                >
                  Faire un don
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<IconShare />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: fund.title,
                        text: fund.description,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  Partager
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, mt: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {totalDonations.toLocaleString()} GF
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Total collecté
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {totalDonors}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Total des donateurs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {averageDonation.toFixed(2)} GF
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Don moyen
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {progress.toFixed(1)}%
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Progression des objectifs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Dons récents</Typography>
            <Button
              variant="outlined"
              startIcon={<IconDownload />}
              onClick={() => {/* Add export functionality */ }}
            >
              Exporter
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donneur</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleDonations.map((donation) => (
                  <TableRow key={donation.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={donation.anonymous ? null : donation.avatar}
                          sx={{ mr: 2 }}
                        >
                          {donation.anonymous ? 'A' : donation.donorName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {donation.anonymous ? 'Anonymous Donor' : donation.donorName}
                          </Typography>
                          {!donation.anonymous && (
                            <Typography variant="caption" color="text.secondary">
                              {donation.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(donation.donationDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" color="primary.main">
                        {donation.amount.toLocaleString()} GF
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {donation.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={donation.status}
                        color={getStatusColor(donation.status)}
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

export default FundDetail;
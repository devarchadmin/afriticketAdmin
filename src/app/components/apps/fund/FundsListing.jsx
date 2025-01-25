'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTheme } from '@mui/material/styles';
import { 
  fetchFunds,
  DeleteFund, 
  getVisibleFunds,
  calculateFundProgress,
  isExpiringSoon,
  setSelectedOrganization
} from '@/store/apps/fund/FundSlice';
import { IconTrash, IconEdit, IconAlertTriangle } from '@tabler/icons-react';
import FundAdd from './FundAdd';

const organizations = {
  1: { name: "Fondation Médicale Espoir", logo: "/images/organizations/medical-hope.jpg" },
  2: { name: "Fondation Éducation pour Tous", logo: "/images/organizations/edu-all.jpg" },
  3: { name: "Réseau de Secours Mondial", logo: "/images/organizations/global-relief.jpg" },
  4: { name: "Société Pattes & Soins", logo: "/images/organizations/paws-care.jpg" },
  5: { name: "Fondation Communautaire Unie", logo: "/images/organizations/united-community.jpg" }
};

const FundsListing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const selectedOrganization = useSelector((state) => state.fundReducer.selectedOrganization);

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  const funds = useSelector((state) =>
    getVisibleFunds(
      state.fundReducer.funds,
      state.fundReducer.currentFilter,
      state.fundReducer.fundSearch,
      selectedOrganization
    ),
  );

  const handleCreateFund = () => {
    setSelectedFund(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFund(null);
  };

  const handleUpdateFund = (fundId) => {
    const fundToUpdate = funds.find((fund) => fund.Id === fundId);
    setSelectedFund(fundToUpdate);
    setIsModalOpen(true);
  };

  const handleDeleteFund = (fundId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fonds ?')) {
      dispatch(DeleteFund(fundId));
    }
  };

  const handleFundClick = (fundId) => {
    router.push(`/fund/${fundId}`);
  };

  const handleOrganizationChange = (event) => {
    dispatch(setSelectedOrganization(event.target.value));
  };

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Organisation</InputLabel>
          <Select
            value={selectedOrganization}
            label="Organisation"
            onChange={handleOrganizationChange}
          >
            <MenuItem value="all">Toutes les organisations</MenuItem>
            {Object.entries(organizations).map(([id, org]) => (
              <MenuItem key={id} value={id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={org.logo} sx={{ width: 24, height: 24 }} />
                  {org.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateFund}
          sx={{ px: 3 }}
        >
          + Fonds
        </Button>
      </Box>

      <FundAdd 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        fundData={selectedFund}
      />

      <Grid container spacing={3}>
        {funds.map((fund) => {
          const progress = calculateFundProgress(fund.raisedAmount, fund.requestedAmount);
          const expiringSoon = isExpiringSoon(fund.deadline);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={fund.Id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all .2s' }
                }}
                onClick={() => handleFundClick(fund.Id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://api.afrikticket.com/storage/${fund.images[0]}`}
                  alt={fund.title}
                  sx={{ borderRadius: '5px' }}
                />
                <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        src={fund.organization?.logo}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {fund.organization?.name}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Typography 
                        variant="caption"
                        sx={{
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {fund.category}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{
                          backgroundColor: fund.status === 'active' ? 'success.light' : 'error.light',
                          color: fund.status === 'active' ? 'success.main' : 'error.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {fund.status === 'active' ? 'Actif' : 'Terminé'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" gutterBottom noWrap>
                      {fund.title}
                    </Typography>
                    {expiringSoon && (
                      <Tooltip title="Expiring Soon">
                        <IconAlertTriangle size={20} color={theme.palette.warning.main} />
                      </Tooltip>
                    )}
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      height: 60,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {fund.description}
                  </Typography>

                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Progrès</Typography>
                      <Typography variant="body2">{progress.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Soulevé
                      </Typography>
                      <Typography variant="h6">
                        {fund.raisedAmount.toLocaleString()} GF
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        But
                      </Typography>
                      <Typography variant="h6">
                          {fund.requestedAmount.toLocaleString()} GF
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Donateurs
                      </Typography>
                      <Typography variant="h6">
                          {fund.donors}
                      </Typography>
                    </Box>
                  </Box>

                  <Box 
                    mt={2}
                    display="flex" 
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      Date limite: {format(new Date(fund.deadline), 'MMM d, yyyy')}
                    </Typography>
                    <Box>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFund(fund.Id);
                        }}
                        size="small"
                      >
                        <IconEdit size={20} />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFund(fund.Id);
                        }}
                        size="small"
                        color="error"
                      >
                        <IconTrash size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default FundsListing;

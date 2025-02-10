'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingFunds, handleApproveFund, handleRejectFund } from '@/store/apps/funds/FundsSlice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import RejectDialog from './RejectDialog';
import FundAdd from './FundAdd';
import { getOrganizations } from '@/app/api/organizations/OrganizationData';

const PendingFundListing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [fundToReject, setFundToReject] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  // Get pagination info from Redux
  const { currentPage, totalPages, totalItems } = useSelector(
    (state) => state.fundsReducer.pagination
  );

  useEffect(() => {
    dispatch(fetchPendingFunds());
  }, [dispatch, currentPage]); // Refetch when page changes

  // Fetch organizations when the component mounts
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await getOrganizations();
        const orgsData = response.data.map(item => ({
          id: item.organization.id,
          name: item.organization.name,
          logo: item.organization.user?.profile_image || '/images/profile/default.jpg'
        }));
        setOrganizations(orgsData);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    fetchOrgs();
  }, []);

  // Get funds from Redux
  const funds = useSelector((state) => {
    const allFunds = state.fundsReducer.pendingFunds || [];
    if (selectedOrganization === 'all') return allFunds;
    return allFunds.filter(fund => 
      fund.organization?.id?.toString() === selectedOrganization
    );
  });

  const handlePageChange = (event, newPage) => {
    // Reset to page 1 on org change
    if (selectedOrganization !== 'all') {
      dispatch(fetchPendingFunds(1));
    } else {
      dispatch(fetchPendingFunds(newPage));
    }
  };

  const handleOrganizationChange = (event) => {
    setSelectedOrganization(event.target.value);
    dispatch(fetchPendingFunds(1)); // Reset to first page when changing organization
  };

  const handleCreateFund = () => {
    setSelectedFund(null);
    setFundDialogOpen(true);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'success',
      'pending': 'warning',
      'completed': 'default',
      'rejected': 'error'
    };
    return statusColors[status] || 'default';
  };


  const handleFundClick = (fundId) => {
    router.push(`/fund/${fundId}`);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={4} mp={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Organisation</InputLabel>
          <Select
            value={selectedOrganization}
            label="Organisation"
            onChange={handleOrganizationChange}
          >
            <MenuItem value="all">Toutes les organisations</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={org.id.toString()}>
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

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Organisation</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Titre</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date de création</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Statut</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Objectif (GF)</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds.map((fund) => (
              <TableRow key={fund.id} hover>
                <TableCell>{fund.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={fund.organization?.logo || '/images/logos/logo-afrik-ticket.webp'} 
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography variant="subtitle2">
                      {fund.organization?.name || 'Organisation inconnue'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      noWrap
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => handleFundClick(fund.id)}
                    >
                      {fund.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      noWrap
                      sx={{ maxWidth: '250px' }}
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {fund.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(fund.created_at), 'd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={fund.status}
                    color={getStatusColor(fund.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {fund.goal?.toLocaleString()} GF
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Approuver">
                      <IconButton 
                        color="success"
                        onClick={() => dispatch(handleApproveFund(fund.id))}
                      >
                        <IconCheck size="20" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rejeter">
                      <IconButton 
                        color="error"
                        onClick={() => {
                          setFundToReject(fund);
                          setRejectDialogOpen(true);
                        }}
                      >
                        <IconX size="20" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} display="flex" alignItems="center" justifyContent="space-between" px={2}>
        <Typography variant="body2" color="textSecondary">
          Total: {totalItems} fonds
        </Typography>
        <Pagination 
          count={totalPages} 
          page={currentPage}
          onChange={handlePageChange}
          color="primary" 
        />
      </Box>

      <RejectDialog 
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setFundToReject(null);
        }}
        onConfirm={async (reason) => {
          if (fundToReject) {
            return dispatch(handleRejectFund(fundToReject.id, reason)).then(() => {
              setRejectDialogOpen(false);
              setFundToReject(null);
            });
          }
        }}
      />

      <FundAdd 
        open={fundDialogOpen}
        onClose={() => {
          setFundDialogOpen(false);
          setSelectedFund(null);
        }}
        fundData={selectedFund}
      />
    </>
  );
};

export default PendingFundListing;

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

const PendingFundListing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [fundToReject, setFundToReject] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPendingFunds());
  }, [dispatch]);

  const funds = useSelector((state) => {
    const allFunds = state.fundsReducer.pendingFunds || [];
    if (selectedOrganization === 'all') return allFunds;
    return allFunds.filter(fund => 
      fund.organization?.id?.toString() === selectedOrganization
    );
  });

  const organizations = {};
  funds.forEach(fund => {
    if (fund.organization) {
      organizations[fund.organization.id] = {
        name: fund.organization.name,
        logo: fund.organization.logo || '/images/logos/logo-afrik-ticket.webp'
      };
    }
  });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOrganizationChange = (event) => {
    setSelectedOrganization(event.target.value);
    setPage(1);
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

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedFunds = funds.slice(startIndex, endIndex);

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
            {paginatedFunds.map((fund) => (
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

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination 
          count={Math.ceil(funds.length / rowsPerPage)} 
          page={page}
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

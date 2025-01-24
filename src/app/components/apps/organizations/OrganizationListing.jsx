'use client'
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getOrganizations, formatOrganizationData, updateOrganizationStatus } from '@/app/api/organizations/OrganizationData';
import OrganizationFilter from './OrganizationFilter';

const OrganizationListing = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [totalPages, setTotalPages] = useState(1);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);

  const fetchOrganizationsData = async () => {
    try {
      setLoading(true);
      const data = await getOrganizations(page);
      const formattedData = formatOrganizationData(data.data);
      setOrganizations(formattedData);
      setTotalPages(data.last_page);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsData();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewDetails = (organizationId) => {
    router.push(`/organizations/${organizationId}`);
  };

  const handleApprove = async (organizationId) => {
    try {
      setError(null);
      console.log('Approving organization:', organizationId);
      const result = await updateOrganizationStatus(organizationId, 'approved');
      console.log('Approval result:', result);
      
      // Update the local state optimistically
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === organizationId 
            ? { 
                ...org,
                status: 'approved',
                user: {
                  ...org.user,
                  status: 'approved'
                }
              }
            : org
        )
      );
      
      // Refresh data from server
      await fetchOrganizationsData();
    } catch (err) {
      console.error('Approval error:', err);
      setError(err.message);
    }
  };

  const handleRejectClick = (organizationId) => {
    setSelectedOrganizationId(organizationId);
    setRejectDialogOpen(true);
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectionReason('');
    setSelectedOrganizationId(null);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    
    try {
      setError(null);
      console.log('Rejecting organization:', selectedOrganizationId, 'with reason:', rejectionReason);
      const result = await updateOrganizationStatus(selectedOrganizationId, 'rejected', rejectionReason.trim());
      console.log('Rejection result:', result);
      
      // Update the local state optimistically
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === selectedOrganizationId 
            ? { 
                ...org,
                status: 'rejected',
                rejection_reason: rejectionReason.trim(),
                user: {
                  ...org.user,
                  status: 'rejected'
                }
              }
            : org
        )
      );
      
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedOrganizationId(null);
      
      // Refresh data from server
      await fetchOrganizationsData();
    } catch (err) {
      console.error('Rejection error:', err);
      setError(err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Special handling for 'pending' filter
    if (filter === 'pending') {
      return matchesSearch && !['approved', 'rejected'].includes(org.status);
    }
    
    return matchesSearch && (filter === 'all' || org.status === filter);
  });

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Alert severity="error">Erreur: {error}</Alert>;

  return (
    <Box mt={4}>
      <OrganizationFilter onFilterChange={handleFilterChange} />
      
      <Box display="flex" justifyContent="space-between" mb={3} mt={4}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer</InputLabel>
          <Select
            value={filter}
            label="Filtrer"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Toutes les organisations</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="approved">Approuvées</MenuItem>
            <MenuItem value="rejected">Rejetées</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Rechercher"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Événements</TableCell>
              <TableCell>Total collecté</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrganizations.map((org) => (
              <TableRow key={org.id} hover>
                <TableCell>
                  <Avatar 
                    src={org.user?.profile_image || '/images/profile/default.jpg'} 
                    variant="rounded" 
                    sx={{ width: 50, height: 50 }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {org.name}
                  </Typography>
                </TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>{org.description || 'Non spécifiée'}</TableCell>
                <TableCell>
                  {format(new Date(org.registration_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={org.status}
                    color={getStatusColor(org.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{org.events_count}</TableCell>
                <TableCell>{org.fundraisings_count}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetails(org.id)}
                      >
                        <IconEye width={20} />
                      </IconButton>
                    </Tooltip>
                    {org.status === 'pending' && (
                      <>
                        <Tooltip title="Approuver">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(org.id)}
                          >
                            <IconCheck width={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeter">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectClick(org.id)}
                          >
                            <IconX width={20} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleRejectCancel}>
        <DialogTitle>Reject Organization</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            error={error && !rejectionReason.trim()}
            helperText={error && !rejectionReason.trim() ? 'Rejection reason is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel}>Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationListing;
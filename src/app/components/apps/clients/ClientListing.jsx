'use client';
import { useState, useEffect } from 'react';
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
  Avatar,
  Tooltip,
  TextField,
  Pagination,
} from '@mui/material';
import { IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import { getClients, formatUserData } from '../../../api/clients/ClientsData';

const ClientListing = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, [page]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients(page);
      setClients(formatUserData(data.data));
      setTotalPages(data.last_page);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewDetails = (id) => {
    // Implement view details functionality
    console.log('View details for user:', id);
  };

  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">Erreur: {error}</Typography>;

  return (
    <Box mt={4}>
      <Box mb={3}>
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
              <TableCell>Profil</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Total dépensé</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} hover>
                <TableCell>
                  <Avatar 
                    src={client.profile_image ? `https://api.afrikticket.com/storage/${client.profile_image}` : '/images/profile/default.jpg'} 
                    alt={client.name}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {client.name}
                  </Typography>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  {format(new Date(client.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {/* We'll need to add this data from the API */}
                  0 GF
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(client.id)}
                    >
                      <IconEye width={20} />
                    </IconButton>
                  </Tooltip>
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
    </Box>
  );
};

export default ClientListing;
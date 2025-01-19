'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination
} from '@mui/material';
import { IconSearch, IconFilter } from '@tabler/icons-react';

const PaymentsListing = ({ transactions = [] }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const rowsPerPage = 10;

  // Filter transactions based on search term and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'processed'
        ? transaction.status === 'Terminé'
        : transaction.status === 'En attente';
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calculate totals
  const calculateTotals = () => {
    const completed = transactions
      .filter(t => t.status === 'Terminé')
      .reduce((sum, t) => sum + t.amount, 0);

    const pending = transactions
      .filter(t => t.status === 'En attente')
      .reduce((sum, t) => sum + t.amount, 0);

    const total = completed + pending;

    return { total, completed, pending };
  };

  const totals = calculateTotals();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
        return 'success';
      case 'En attente':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Filtering and Search Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="center"
          gap={2}
        >
          <TextField
            label="Rechercher une organisation"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={20} style={{ marginRight: 10 }} />
            }}
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Filtrer par statut</InputLabel>
            <Select
              value={statusFilter}
              label="Filtrer par statut"
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<IconFilter size={20} style={{ marginRight: 10 }} />}
            >
              <MenuItem value="all">Toutes les transactions</MenuItem>
              <MenuItem value="processed">Transactions terminées</MenuItem>
              <MenuItem value="pending">Transactions en attente</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="600">Organisation</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="600">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="600">Montant</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="600">Type</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="600">Statut</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Aucune transaction trouvée
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Il n'y a aucune transaction à afficher pour le moment.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.organizationName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(transaction.date), 'dd MMM yyyy')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(transaction.date), 'HH:mm')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {transaction.amount.toLocaleString()} GF
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type}
                      size="small"
                      color={transaction.type === 'Incoming' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      size="small"
                      color={getStatusColor(transaction.status)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box my={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredTransactions.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PaymentsListing;
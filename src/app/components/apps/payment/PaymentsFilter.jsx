'use client'
import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { format } from 'date-fns';
import { 
  IconReport, 
  IconWallet, 
  IconCurrencyEuro, 
  IconTransfer 
} from '@tabler/icons-react';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  color: 'inherit',
}));

const organizations = [
  { id: 1, name: "Fondation Médicale Espoir" },
  { id: 2, name: "Fondation Éducation pour Tous" },
  { id: 3, name: "Réseau de Secours Mondial" }
];

const initialTransactions = [
  {
    id: 1,
    organizationName: "Fondation Médicale Espoir",
    date: new Date('2024-01-15'),
    amount: 75000,
    method: "Virement bancaire",
    status: "Terminé",
    type: "Incoming"
  },
  {
    id: 2,
    organizationName: "Fondation Éducation pour Tous",
    date: new Date('2024-02-20'),
    amount: 50000,
    method: "Paiement en ligne",
    status: "En attente",
    type: "Outgoing"
  },
  {
    id: 3,
    organizationName: "Réseau de Secours Mondial",
    date: new Date('2024-03-10'),
    amount: 100000,
    method: "Chèque",
    status: "Terminé",
    type: "Incoming"
  }
];

const PaymentsFilter = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('all');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    organization: '',
    amount: '',
    type: 'Outgoing'
  });

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    const incomingAmount = transactions
      .filter(t => t.type === 'Incoming' && t.status === 'Terminé')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const outgoingAmount = transactions
      .filter(t => t.type === 'Outgoing')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingOutgoing = transactions
      .filter(t => t.type === 'Outgoing' && t.status === 'En attente')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      currentBalance: incomingAmount - outgoingAmount,
      pendingAmount: pendingOutgoing,
      totalIncoming: incomingAmount,
      totalOutgoing: outgoingAmount
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filter === 'all') return true;
      if (filter === 'incoming') return transaction.type === 'Incoming';
      if (filter === 'outgoing') return transaction.type === 'Outgoing';
      if (filter === 'processed') return transaction.status === 'Terminé';
      if (filter === 'pending') return transaction.status === 'En attente';
      return true;
    });
  }, [transactions, filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'success';
      case 'En attente': return 'warning';
      default: return 'default';
    }
  };

  const handleCreateTransaction = () => {
    const newTransactionEntry = {
      id: transactions.length + 1,
      organizationName: organizations.find(
        org => org.id === parseInt(newTransaction.organization)
      ).name,
      date: new Date(),
      amount: parseFloat(newTransaction.amount),
      method: 'Virement',
      status: 'En attente',
      type: newTransaction.type
    };

    setTransactions([...transactions, newTransactionEntry]);
    setOpenTransactionModal(false);
    setNewTransaction({ organization: '', amount: '', type: 'Outgoing' });
  };

  return (
    <Box>
      {/* Wallet and Transaction Overview */}
      <Grid container spacing={3} textAlign="center" mb={3}>
        <Grid item xs={12} md={4}>
          <BoxStyled sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <IconWallet style={{ marginRight: 10 }} />
              <Typography variant="h6">Solde actuel</Typography>
            </Box>
            <Typography variant="h3">
              {financialMetrics.currentBalance.toLocaleString()} GF
            </Typography>
          </BoxStyled>
        </Grid>
        <Grid item xs={12} md={4}>
          <BoxStyled sx={{ backgroundColor: 'success.light', color: 'success.main' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <IconCurrencyEuro style={{ marginRight: 10 }} />
              <Typography variant="h6">Total entrant</Typography>
            </Box>
            <Typography variant="h3">
              {financialMetrics.totalIncoming.toLocaleString()} GF
            </Typography>
          </BoxStyled>
        </Grid>
        <Grid item xs={12} md={4}>
          <BoxStyled sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <IconTransfer style={{ marginRight: 10 }} />
              <Typography variant="h6">En attente</Typography>
            </Box>
            <Typography variant="h3">
              {financialMetrics.pendingAmount.toLocaleString()} GF
            </Typography>
          </BoxStyled>
        </Grid>
      </Grid>

      {/* Filtering and Transaction Controls */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer les transactions</InputLabel>
          <Select
            value={filter}
            label="Filtrer les transactions"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">Toutes les transactions</MenuItem>
            <MenuItem value="incoming">Transactions entrantes</MenuItem>
            <MenuItem value="outgoing">Transactions sortantes</MenuItem>
            <MenuItem value="processed">Transactions terminées</MenuItem>
            <MenuItem value="pending">Transactions en attente</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenTransactionModal(true)}
        >
          +&nbsp;&nbsp;Transaction
        </Button>
      </Box>

      {/* Transaction Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organisation</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Méthode</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.organizationName}</TableCell>
                <TableCell>
                  {format(transaction.date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{transaction.amount.toLocaleString()} GF</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.type} 
                    color={transaction.type === 'Incoming' ? 'success' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.status} 
                    color={getStatusColor(transaction.status)} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Transaction Modal */}
      <Dialog 
        open={openTransactionModal} 
        onClose={() => setOpenTransactionModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Nouvelle Transaction</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Organisation</InputLabel>
            <Select
              value={newTransaction.organization}
              label="Organisation"
              onChange={(e) => setNewTransaction(prev => ({
                ...prev, 
                organization: e.target.value
              }))}
            >
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Montant"
            type="number"
            fullWidth
            margin="normal"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction(prev => ({
              ...prev, 
              amount: e.target.value
            }))}
            InputProps={{
              endAdornment: <Typography variant="body2">GF</Typography>
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Type de Transaction</InputLabel>
            <Select
              value={newTransaction.type}
              label="Type de Transaction"
              onChange={(e) => setNewTransaction(prev => ({
                ...prev, 
                type: e.target.value
              }))}
            >
              <MenuItem value="Incoming">Entrant</MenuItem>
              <MenuItem value="Outgoing">Sortant</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionModal(false)} color="secondary">
            Annuler
          </Button>
          <Button 
            onClick={handleCreateTransaction} 
            color="primary" 
            variant="contained"
            disabled={!newTransaction.organization || !newTransaction.amount}
          >
            Créer Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsFilter;
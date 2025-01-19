import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = '/api/data/clients';

const initialState = {
  clients: [],
  currentFilter: 'all_clients',
  clientSearch: '',
  selectedClient: null,
  loading: false,
  error: null
};

export const ClientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    getClients: (state, action) => {
      state.clients = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    SearchClient: (state, action) => {
      state.clientSearch = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { 
  getClients, 
  setVisibilityFilter, 
  SearchClient,
  setSelectedClient,
  setLoading,
  setError
} = ClientSlice.actions;

export const fetchClients = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${API_URL}`);
    dispatch(getClients(response.data));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setError(err.message));
    dispatch(setLoading(false));
  }
};

export const getVisibleClients = (clients, filter, searchTerm) => {
  const searchLower = searchTerm.toLowerCase();
  const baseFilter = (client) => 
    client.firstName.toLowerCase().includes(searchLower) ||
    client.lastName.toLowerCase().includes(searchLower) ||
    client.email.toLowerCase().includes(searchLower);

  switch (filter) {
    case 'all_clients':
      return clients.filter(baseFilter);

    case 'active_clients':
      return clients.filter(client => 
        baseFilter(client) && 
        client.status === 'Active'
      );

    case 'inactive_clients':
      return clients.filter(client => 
        baseFilter(client) && 
        client.status === 'Inactive'
      );

    case 'suspended_clients':
      return clients.filter(client => 
        baseFilter(client) && 
        client.status === 'Suspended'
      );

    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

// Helper functions for client analysis
export const calculateTotalRevenue = (client) => {
  return client.purchaseHistory.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
};

export const getTotalEvents = (client) => {
  return client.purchaseHistory.length;
};

export default ClientSlice.reducer;
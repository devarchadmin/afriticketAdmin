// src/store/apps/tickets/TicketPurchaseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  purchases: [],
  loading: false,
  error: null,
  stats: {
    totalSold: 0,
    totalRevenue: 0,
    pendingOrders: 0
  }
};

export const ticketPurchaseSlice = createSlice({
  name: 'ticketPurchases',
  initialState,
  reducers: {
    getPurchases: (state, action) => {
      state.purchases = action.payload;
      state.loading = false;
      // Calculate statistics
      state.stats = {
        totalSold: action.payload.reduce((sum, p) => sum + p.ticketCount, 0),
        totalRevenue: action.payload.reduce((sum, p) => sum + p.totalAmount, 0),
        pendingOrders: action.payload.filter(p => p.status === 'Pending').length
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  getPurchases,
  setLoading,
  setError
} = ticketPurchaseSlice.actions;

export const fetchTicketPurchases = (eventId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`/api/tickets/purchases/${eventId}`);
    dispatch(getPurchases(response.data));
  } catch (err) {
    console.error('Error fetching ticket purchases:', err);
    dispatch(setError(err.message));
  }
};

export default ticketPurchaseSlice.reducer;
import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = '/api/data/payments/PaymentData';
const SUMMARY_URL = '/api/data/payments/PaymentSummary';

const initialState = {
  payments: [],
  paymentSummary: {
    totalCollectedAmount: 0,
    totalAcquiredAmount: 0,
    amountToBeCollected: 0
  },
  currentFilter: 'all_payments',
  paymentSearch: '',
};

export const PaymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    getPayments: (state, action) => {
      state.payments = action.payload;
    },
    getPaymentSummary: (state, action) => {
      state.paymentSummary = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    SearchPayment: (state, action) => {
      state.paymentSearch = action.payload;
    },
    DeletePayment: (state, action) => {
      const index = state.payments.findIndex((payment) => payment.Id === action.payload);
      state.payments.splice(index, 1);
    },
    AddPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    UpdatePayment: (state, action) => {
      const index = state.payments.findIndex((payment) => payment.Id === action.payload.Id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
  },
});

export const { 
  getPayments, 
  getPaymentSummary,
  setVisibilityFilter, 
  SearchPayment, 
  DeletePayment,
  AddPayment,
  UpdatePayment 
} = PaymentSlice.actions;

export const fetchPayments = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    console.log("payments response", response.data)
    dispatch(getPayments(response.data));
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchPaymentSummary = () => async (dispatch) => {
  try {
    const response = await axios.get(`${SUMMARY_URL}`);
    console.log("payment summary response", response.data)
    dispatch(getPaymentSummary(response.data));
  } catch (err) {
    throw new Error(err);
  }
};

export const getVisiblePayments = (payments, filter, paymentSearch) => {
  const searchTerm = (paymentSearch || '').toLowerCase();
  
  switch (filter) {
    case 'all_payments':
      return payments.filter(
        (p) => !p.deleted && 
               (p.eventId || p.fundId) && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );

    case 'processed_payments':
      return payments.filter(
        (p) => !p.deleted && 
               p.status === 'Processed' && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );

    case 'pending_payments':
      return payments.filter(
        (p) => !p.deleted && 
               p.status === 'Pending' && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );

    case 'event_payments':
      return payments.filter(
        (p) => !p.deleted && 
               p.eventId && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );

    case 'fund_payments':
      return payments.filter(
        (p) => !p.deleted && 
               p.fundId && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );

    default:
      return payments.filter(
        (p) => !p.deleted && 
               (p.eventId || p.fundId) && 
               (searchTerm === '' || 
                (p.paymentMethod && p.paymentMethod.toLowerCase().includes(searchTerm)))
      );
  }
};

export default PaymentSlice.reducer;
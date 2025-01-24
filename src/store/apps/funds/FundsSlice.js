import axiosServices from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const FUNDS_URL = 'https://api.afrikticket.com/api/funds';
const PENDING_FUNDS_URL = 'https://api.afrikticket.com/api/admin/pending/fundraisings';
const REVIEW_FUND_URL = 'https://api.afrikticket.com/api/admin/fundraisings';

// Check store for active admin session
const checkAdminSession = () => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    throw new Error('Admin authentication required');
  }
  return adminToken;
};

const initialState = {
  pendingFunds: [],
  fundsSearch: '',
  allFunds: []
};

const mapFundData = (fund) => ({
  id: fund?.id || '',
  title: fund?.title || '',
  description: fund?.description || '',
  goal: parseFloat(fund?.goal) || 0,
  currentAmount: parseFloat(fund?.current) || 0,
  status: fund?.status || 'pending',
  created_at: fund?.created_at || '',
  updated_at: fund?.updated_at || '',
  organization: fund?.organization || null
});

export const FundsSlice = createSlice({
  name: 'funds',
  initialState,
  reducers: {
    setPendingFunds: (state, action) => {
      state.pendingFunds = action.payload;
    },
    setAllFunds: (state, action) => {
      state.allFunds = action.payload;
    },
    SearchFunds: (state, action) => {
      state.fundsSearch = action.payload;
    },
    ApproveFund: (state, action) => {
      const index = state.pendingFunds.findIndex((fund) => fund.id === action.payload);
      if (index !== -1) {
        state.pendingFunds[index].status = 'active';
      }
    },
    RejectFund: (state, action) => {
      const index = state.pendingFunds.findIndex((fund) => fund.id === action.payload);
      if (index !== -1) {
        state.pendingFunds[index].status = 'rejected';
      }
    },
    AddFund: (state, action) => {
      state.pendingFunds.unshift(action.payload);
    },
    UpdateFund: (state, action) => {
      const index = state.pendingFunds.findIndex((fund) => fund.id === action.payload.id);
      if (index !== -1) {
        state.pendingFunds[index] = action.payload;
      }
    },
  },
});

export const {
  setPendingFunds,
  setAllFunds,
  SearchFunds,
  ApproveFund,
  RejectFund,
  AddFund,
  UpdateFund,
} = FundsSlice.actions;

const handleFundReview = async (dispatch, fundId, status, reason = '') => {
  try {
    const payload = status === 'active' 
      ? { status: 'active' } 
      : { status: 'rejected', reason };

    if (!reason && status === 'rejected') {
      throw new Error('Reason is required for rejection');
    }

    await axiosServices.put(`${REVIEW_FUND_URL}/${fundId}/review`, payload);
    
    if (status === 'active') {
      dispatch(ApproveFund(fundId));
    } else {
      dispatch(RejectFund(fundId));
    }
    dispatch(fetchPendingFunds()); // Refresh the funds list
  } catch (error) {
    console.error(`Fund review failed:`, error);
    throw error;
  }
};

export const handleApproveFund = (fundId) => async (dispatch) => {
  return handleFundReview(dispatch, fundId, 'active');
};

export const handleRejectFund = (fundId, reason) => async (dispatch) => {
  return handleFundReview(dispatch, fundId, 'rejected', reason);
};

export const fetchPendingFunds = () => async (dispatch) => {
  console.log('Fetching pending funds...');
  console.log('URL:', `${PENDING_FUNDS_URL}?per_page=100`);
  
  try {
    // Verify admin session first
    checkAdminSession();
    
    console.log('Making API request...');
    const response = await axiosServices.get(`${PENDING_FUNDS_URL}?per_page=100`);
    
    console.log('API Response received:', response);
    console.log('Response status:', response?.data?.status);
    console.log('Response data:', response?.data);
    
    if (response?.data?.status === 'success' && response?.data?.data) {
      const pendingData = response.data.data;
      console.log('Pending data before mapping:', pendingData);
      
      const funds = Array.isArray(pendingData) 
        ? pendingData.map(fund => {
            console.log('Mapping fund:', fund);
            return mapFundData(fund);
          })
        : [];
      
      console.log('Mapped funds:', funds);
      dispatch(setPendingFunds(funds));
    } else {
      console.log('No valid data in response, setting empty array');
      dispatch(setPendingFunds([]));
    }
  } catch (error) {
    console.error('Pending funds fetch failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    dispatch(setPendingFunds([]));
  }
};

export default FundsSlice.reducer;

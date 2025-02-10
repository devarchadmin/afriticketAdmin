import axiosServices, { getStorageItem } from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const FUNDS_URL = 'https://api.afrikticket.com/api/fundraising';
const PENDING_FUNDS_URL = 'https://api.afrikticket.com/api/admin/pending/fundraisings';
const REVIEW_FUND_URL = 'https://api.afrikticket.com/api/admin/fundraisings';

// Check store for active admin session
const checkAdminSession = () => {
  const adminToken = getStorageItem('adminToken');
  if (!adminToken) {
    throw new Error('Admin authentication required');
  }
  return adminToken;
};

const initialState = {
  pendingFunds: [],
  fundsSearch: '',
  allFunds: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

const mapFundData = (data) => {
  const fund = data.fundraising;
  const stats = data.stats;
  
  return {
    id: fund?.id || '',
    title: fund?.title || '',
    description: fund?.description || '',
    goal: parseFloat(fund?.goal) || 0,
    currentAmount: parseFloat(fund?.current) || 0,
    status: fund?.status || 'pending',
    category: fund?.category || '',
    created_at: fund?.created_at || '',
    updated_at: fund?.updated_at || '',
    organization: fund?.organization || null,
    images: fund?.images || [],
    donations: fund?.donations || [],
    stats: {
      totalDonors: stats?.total_donors || 0,
      totalRaised: stats?.total_raised || 0,
      progressPercentage: stats?.progress_percentage || 0,
      remainingAmount: stats?.remaining_amount || 0,
      averageDonation: stats?.average_donation || 0
    }
  };
};

export const FundsSlice = createSlice({
  name: 'funds',
  initialState,
  reducers: {
    setPendingFunds: (state, action) => {
      state.pendingFunds = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
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
  setPagination,
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

    console.log('Review request:', {
      url: `${REVIEW_FUND_URL}/${fundId}/review`,
      payload
    });

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

// New action to fetch all fundraising campaigns
export const fetchAllFundraisings = () => async (dispatch) => {
  try {
    console.log('Fetching all fundraisings...');
    const response = await axiosServices.get(FUNDS_URL);
    console.log('API Response:', response.data);
    
    if (response?.data?.status === 'success' && response.data.data?.fundraisings) {
      console.log('Processing fundraisings data...');
      const funds = response.data.data.fundraisings.map(fundData => {
        const mapped = mapFundData(fundData);
        console.log('Mapped fundraising:', mapped);
        return mapped;
      });
      console.log('Total fundraisings processed:', funds.length);
      dispatch(setAllFunds(funds));
    } else {
      console.warn('No valid fundraisings data in response');
      dispatch(setAllFunds([]));
    }
  } catch (error) {
    console.error('Failed to fetch fundraisings:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    dispatch(setAllFunds([]));
  }
};

export const fetchPendingFunds = (page = 1) => async (dispatch) => {
  console.log('Fetching pending funds for page:', page);
  console.log('URL:', `${PENDING_FUNDS_URL}?page=${page}`);
  
  try {
    // Verify admin session first
    checkAdminSession();
    
    console.log('Making API request...');
    const response = await axiosServices.get(`${PENDING_FUNDS_URL}?page=${page}`);
    
    console.log('API Response received:', response.data);
    
    if (response?.data?.status === 'success' && response.data.data) {
      const paginatedData = response.data.data;
      
      // Update pagination info
      dispatch(setPagination({
        currentPage: paginatedData.current_page || 1,
        totalPages: paginatedData.last_page || 1,
        totalItems: paginatedData.total || 0
      }));
      
      // Map the funds data
      if (Array.isArray(paginatedData.data)) {
        console.log('Mapping funds from paginated data:', paginatedData.data);
        const funds = paginatedData.data.map(mapFundData);
        console.log('Mapped funds:', funds);
        dispatch(setPendingFunds(funds));
      } else {
        console.error('No array data in paginated response:', paginatedData);
        dispatch(setPendingFunds([]));
      }
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

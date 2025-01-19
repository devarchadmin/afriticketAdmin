import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = 'https://api.afrikticket.com/api/fundraising';

const initialState = {
  funds: [],
  currentFilter: 'all_funds',
  fundSearch: '',
  selectedOrganization: 'all'
};

export const FundSlice = createSlice({
  name: 'fund',
  initialState,
  reducers: {
    getFunds: (state, action) => {
      state.funds = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    SearchFund: (state, action) => {
      state.fundSearch = action.payload;
    },
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
    },
    DeleteFund: (state, action) => {
      const index = state.funds.findIndex((fund) => fund.Id === action.payload);
      state.funds.splice(index, 1);
    },
    AddFund: (state, action) => {
      state.funds.push(action.payload);
    },
    UpdateFund: (state, action) => {
      const index = state.funds.findIndex((fund) => fund.Id === action.payload.Id);
      if (index !== -1) {
        state.funds[index] = action.payload;
      }
    },
    UpdateFundAmount: (state, action) => {
      const index = state.funds.findIndex((fund) => fund.Id === action.payload.Id);
      if (index !== -1) {
        state.funds[index].raisedAmount += Number(action.payload.amount);
        state.funds[index].donors += 1;
      }
    },
  },
});

export const { 
  getFunds, 
  setVisibilityFilter, 
  SearchFund, 
  setSelectedOrganization,
  DeleteFund,
  AddFund,
  UpdateFund,
  UpdateFundAmount 
} = FundSlice.actions;

export const fetchFunds = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL);
    const formattedFunds = response.data.data.fundraisings.map(({ fundraising, stats }) => ({
      Id: fundraising.id,
      title: fundraising.title,
      description: fundraising.description,
      requestedAmount: parseFloat(fundraising.goal),
      minimumAmount: 10, // Default minimum amount
      raisedAmount: parseFloat(fundraising.current),
      category: "General",
      deadline: new Date(fundraising.created_at),
      organizationId: fundraising.organization_id,
      organization: {
        name: fundraising.organization.name,
        logo: '/images/organizations/default.jpg'
      },
      status: fundraising.status,
      beneficiary: fundraising.organization.name,
      images: fundraising.images.map(img => img.image_path),
      donors: stats.total_donors,
      deleted: false
    }));
    dispatch(getFunds(formattedFunds));
  } catch (err) {
    console.error('Error fetching funds:', err);
    throw err;
  }
};

export const getVisibleFunds = (funds, filter, fundSearch, selectedOrganization = 'all') => {
  const searchTerm = (fundSearch || '').toLowerCase();
  const baseFilter = (f) => (
    !f.deleted && 
    f.title.toLowerCase().includes(searchTerm) &&
    (selectedOrganization === 'all' || f.organizationId.toString() === selectedOrganization)
  );
  
  switch (filter) {
    case 'all_funds':
      return funds.filter(baseFilter);

    case 'active_funds':
      return funds.filter(f => 
        baseFilter(f) && 
        f.status === 'active'
      );

    case 'completed_funds':
      return funds.filter(f => 
        baseFilter(f) && 
        f.status === 'completed'
      );

    case 'medical_funds':
      return funds.filter(f =>
        baseFilter(f) &&
        f.category === 'Médical'
      );

    case 'education_funds':
      return funds.filter(f =>
        baseFilter(f) &&
        f.category === 'Éducation'
      );

    case 'disaster_funds':
      return funds.filter(f =>
        baseFilter(f) &&
        f.category === 'Secours en Cas de Catastrophe'
      );

    case 'animal_funds':
      return funds.filter(f =>
        baseFilter(f) &&
        f.category === 'Bien-être Animal'
      );

    case 'community_funds':
      return funds.filter(f =>
        baseFilter(f) &&
        f.category === 'Communauté'
      );

    case 'expiring_soon':
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      
      return funds.filter(f =>
        baseFilter(f) &&
        new Date(f.deadline) <= oneWeekFromNow &&
        new Date(f.deadline) > new Date() &&
        f.raisedAmount < f.requestedAmount
      );

    default:
      return funds.filter(baseFilter);
  }
};

export const calculateFundProgress = (raisedAmount, requestedAmount) => {
  return Math.min((raisedAmount / requestedAmount) * 100, 100);
};

export const isExpiringSoon = (deadline) => {
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const deadlineDate = new Date(deadline);
  
  return deadlineDate <= oneWeekFromNow && deadlineDate > new Date();
};

export default FundSlice.reducer;
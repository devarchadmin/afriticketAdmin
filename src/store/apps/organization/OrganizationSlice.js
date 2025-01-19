// store/apps/organization/OrganizationSlice.js
import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = '/api/data/organizations';

const initialState = {
  organizations: [],
  currentFilter: 'all_organizations',
  organizationSearch: '',
  selectedOrganization: null,
  loading: false,
  error: null
};

export const OrganizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    getOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
    },
    SearchOrganization: (state, action) => {
      state.organizationSearch = action.payload;
    },
    approveOrganization: (state, action) => {
      const index = state.organizations.findIndex((org) => org.id === action.payload);
      if (index !== -1) {
        state.organizations[index].status = 'verified';
      }
    },
    rejectOrganization: (state, action) => {
      const index = state.organizations.findIndex((org) => org.id === action.payload);
      if (index !== -1) {
        state.organizations[index].status = 'rejected';
      }
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
  getOrganizations, 
  setVisibilityFilter, 
  SearchOrganization,
  setSelectedOrganization,
  approveOrganization,
  rejectOrganization,
  setLoading,
  setError
} = OrganizationSlice.actions;

export const fetchOrganizations = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${API_URL}`);
    dispatch(getOrganizations(response.data));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setError(err.message));
    dispatch(setLoading(false));
  }
};

export const getVisibleOrganizations = (organizations, filter, searchTerm) => {
  const searchLower = searchTerm.toLowerCase();
  const baseFilter = (org) => 
    org.name.toLowerCase().includes(searchLower) ||
    org.email.toLowerCase().includes(searchLower);

  switch (filter) {
    case 'all_organizations':
      return organizations.filter(baseFilter);

    case 'pending_verification':
      return organizations.filter(org => 
        baseFilter(org) && 
        org.status === 'pending'
      );

    case 'verified_organizations':
      return organizations.filter(org => 
        baseFilter(org) && 
        org.status === 'verified'
      );

    case 'rejected_organizations':
      return organizations.filter(org => 
        baseFilter(org) && 
        org.status === 'rejected'
      );

    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

// Helper function to calculate total raised amount for an organization
export const calculateTotalRaised = (organization) => {
  return organization.metrics.totalRaised;
};

// Helper function to calculate expected amount for an organization
export const calculateExpectedAmount = (organization) => {
  return organization.metrics.expectedAmount;
};

export default OrganizationSlice.reducer;
import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = 'https://api.afrikticket.com/api/events';

const initialState = {
  events: [],
  currentFilter: 'total_events',
  eventSearch: '',
  selectedOrganization: 'all'
};

export const EventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    getEvents: (state, action) => {
      state.events = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    SearchEvent: (state, action) => {
      state.eventSearch = action.payload;
    },
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
    },
    DeleteEvent: (state, action) => {
      const index = state.events.findIndex((event) => event.Id === action.payload);
      state.events.splice(index, 1);
    },
    AddEvent: (state, action) => {
      state.events.push(action.payload);
    },
    UpdateEvent: (state, action) => {
      const index = state.events.findIndex((event) => event.Id === action.payload.Id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
});

export const {
  getEvents,
  setVisibilityFilter,
  SearchEvent,
  DeleteEvent,
  AddEvent,
  UpdateEvent,
  setSelectedOrganization
} = EventSlice.actions;

export const fetchEvents = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL);
    const formattedEvents = response.data.data.map(event => ({
      Id: event.id,
      organizationId: event.organization.id,
      organization: {
        name: event.organization.name,
        logo: event.organization.logo || '/images/organizations/default.jpg'
      },
      ticketTitle: event.title,
      ticketDescription: event.description,
      location: event.location,
      Date: new Date(event.start_date),
      duration: event.duration,
      numberOfTickets: event.remaining_tickets,
      ticketPrice: event.price,
      deleted: false,
      status: new Date(event.end_date) < new Date() ? 'completed' : 'active',
      images: [event.image]
    }));
    dispatch(getEvents(formattedEvents));
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};

export const getVisibleEvents = (events, filter, eventSearch, selectedOrganization = 'all') => {
  const searchTerm = eventSearch.toLowerCase();
  const baseFilter = (event) => (
    !event.deleted && 
    event.ticketTitle.toLowerCase().includes(searchTerm) && 
    (selectedOrganization === 'all' || event.organizationId.toString() === selectedOrganization)
  );

  switch (filter) {
    case 'total_events':
      return events.filter(baseFilter);

    case 'upcoming_events':
      return events.filter(event => 
        baseFilter(event) && 
        event.status === 'active'
      );

    case 'past_events':
      return events.filter(event => 
        baseFilter(event) && 
        event.status === 'completed'
      );

    case 'active_events':
      return events.filter(event => 
        baseFilter(event) && 
        event.status === 'active'
      );

    case 'completed_events':
      return events.filter(event => 
        baseFilter(event) && 
        event.status === 'completed'
      );

    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

export default EventSlice.reducer;
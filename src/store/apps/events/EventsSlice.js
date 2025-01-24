import axiosServices from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const EVENTS_URL = 'https://api.afrikticket.com/api/events';
const PENDING_EVENTS_URL = 'https://api.afrikticket.com/api/admin/pending/events';
const REVIEW_EVENT_URL = 'https://api.afrikticket.com/api/admin/events';

const initialState = {
  events: [],
  currentFilter: 'total_events',
  eventSearch: '',
  selectedOrganization: 'all'
};

const mapEventData = (event) => ({
  Id: event?.id || '',
  organizationId: event?.organization?.id || '',
  organization: {
    name: event?.organization?.name,
    logo: event?.organization?.logo || '/images/logos/logo-afrik-ticket.webp',
    email: event?.organization?.email || '',
    phone: event?.organization?.phone || '',
  },
  ticketTitle: event?.title || '',
  ticketDescription: event?.description || '',
  location: event?.location || '',
  Date: event?.date ? new Date(event.date) : new Date(),
  duration: event?.duration || '',
  numberOfTickets: event?.max_tickets || 0,
  ticketPrice: parseFloat(event?.price) || 0,
  deleted: false,
  status: event?.status || 'active',
  createdAt: event?.created_at || '',
  updatedAt: event?.updated_at || '',
});

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
    ApproveEvent: (state, action) => {
      const index = state.events.findIndex((event) => event.Id === action.payload);
      if (index !== -1) {
        state.events[index].status = 'active';
      }
    },
    RejectEvent: (state, action) => {
      const index = state.events.findIndex((event) => event.Id === action.payload);
      if (index !== -1) {
        state.events[index].status = 'rejected';
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
  setSelectedOrganization,
  ApproveEvent,
  RejectEvent
} = EventSlice.actions;

const getHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

const handleEventReview = async (dispatch, eventId, status, reason = '') => {
  const headers = getHeaders();
  try {
    const payload = status === 'active' 
      ? { status: 'active' } 
      : { status: 'rejected', reason };

    if (!reason && status === 'rejected') {
      throw new Error('Reason is required for rejection');
    }

    await axiosServices.put(`${REVIEW_EVENT_URL}/${eventId}/review`, payload, { headers });
    
    if (status === 'active') {
      dispatch(ApproveEvent(eventId));
    } else {
      dispatch(RejectEvent(eventId));
    }
    dispatch(fetchEvents()); // Refresh the events list
  } catch (error) {
    console.error(`Event review failed:`, error);
    throw error;
  }
};

export const handleApproveEvent = (eventId) => async (dispatch) => {
  return handleEventReview(dispatch, eventId, 'active');
};

export const handleRejectEvent = (eventId, reason) => async (dispatch) => {
  return handleEventReview(dispatch, eventId, 'rejected', reason);
};

export const fetchEvents = () => async (dispatch) => {
  const headers = getHeaders();
  try {
    const eventsResponse = await axiosServices.get(EVENTS_URL);
    const formattedEvents = Array.isArray(eventsResponse?.data?.data) 
      ? eventsResponse.data.data.map(mapEventData)
      : [];

    try {
      const pendingResponse = await axiosServices.get(PENDING_EVENTS_URL, { headers });
      
      let pendingEvents = [];
      if (pendingResponse?.data?.status === 'success' && pendingResponse?.data?.data?.data) {
        // Extract events from paginated response
        const pendingData = pendingResponse.data.data.data;
        pendingEvents = Array.isArray(pendingData) 
          ? pendingData.map(event => ({
              ...mapEventData(event),
              status: 'pending'
            }))
          : [];
      }

      dispatch(getEvents([...formattedEvents, ...pendingEvents]));

    } catch (pendingError) {
      console.error('Pending events error:', {
        message: pendingError.message,
        status: pendingError.response?.status,
        data: pendingError.response?.data
      });
      dispatch(getEvents(formattedEvents));
    }
  } catch (error) {
    console.error('Events fetch failed:', error);
    dispatch(getEvents([]));
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
      throw new Error("Unknown filter: ${filter}");
  }
};

export default EventSlice.reducer;

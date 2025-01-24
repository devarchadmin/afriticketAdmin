import axiosServices from '../../../utils/axios';

const EVENTS_URL = 'https://api.afrikticket.com/api/events';
const PENDING_EVENTS_URL = 'https://api.afrikticket.com/api/admin/pending/events';

const mapEventData = (event) => ({
  Id: event.id,
  organizationId: event.organization.id,
  organization: {
    name: event.organization.name,
    logo: event.organization.logo || '/images/organizations/default.jpg',
  },
  ticketTitle: event.title,
  ticketDescription: event.description,
  location: event.location,
  Date: new Date(event.date || event.start_date),
  duration: event.duration,
  numberOfTickets: event.remaining_tickets || event.max_tickets,
  ticketPrice: event.price,
  deleted: false,
  status: event.status === 'pending' ? 'pending' : 
         new Date(event.end_date || event.date) < new Date() ? 'completed' : 'active',
  images: [event.image],
});

export const fetchEventsFromAPI = async () => {
  try {
    // Fetch regular events first
    const eventsResponse = await axiosServices.get(EVENTS_URL);
    const events = eventsResponse.data.data.map(mapEventData);
    
    try {
      // Try to fetch pending events if authorized
      const pendingEventsResponse = await axiosServices.get(PENDING_EVENTS_URL);
      const pendingEvents = pendingEventsResponse.data.data.map(mapEventData);
      return [...events, ...pendingEvents];
    } catch (pendingError) {
      // If unauthorized for pending events, just return regular events
      if (pendingError.response?.status === 401) {
        console.log('Not authorized to view pending events');
        return events;
      }
      throw pendingError;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
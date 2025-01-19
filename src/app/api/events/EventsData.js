import axios from 'axios';

const API_URL = 'https://api.afrikticket.com/api/events';

export const fetchEventsFromAPI = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data.map(event => ({
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
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
// src/api/tickets/TicketPurchaseData.js
import mock from '../mock';
import { sub } from 'date-fns';

const TicketPurchaseData = [
  {
    id: 1,
    eventId: 1,
    buyerName: "John Doe",
    email: "john.doe@example.com",
    avatar: "/images/profile/user-1.jpg",
    purchaseDate: sub(new Date(), { days: 5 }),
    ticketCount: 2,
    ticketType: "VIP",
    totalAmount: 300,
    status: "Confirmed",
    phone: "+1 234-567-8900"
  },
  {
    id: 2,
    eventId: 1,
    buyerName: "Sarah Smith",
    email: "sarah.smith@example.com",
    avatar: "/images/profile/user-2.jpg",
    purchaseDate: sub(new Date(), { days: 3 }),
    ticketCount: 4,
    ticketType: "Regular",
    totalAmount: 400,
    status: "Pending",
    phone: "+1 234-567-8901"
  },
  {
    id: 3,
    eventId: 1,
    buyerName: "Michael Johnson",
    email: "michael.j@example.com",
    avatar: "/images/profile/user-3.jpg",
    purchaseDate: sub(new Date(), { days: 2 }),
    ticketCount: 1,
    ticketType: "VIP",
    totalAmount: 150,
    status: "Confirmed",
    phone: "+1 234-567-8902"
  }
];

mock.onGet(/\/api\/tickets\/purchases\/\d+/).reply((config) => {
  const eventId = parseInt(config.url.split('/').pop());
  const purchases = TicketPurchaseData.filter(purchase => purchase.eventId === eventId);
  return [200, purchases];
});

export default TicketPurchaseData;
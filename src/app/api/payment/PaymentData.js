import mock from '../mock';
import { Chance } from 'chance';

const chance = new Chance();

// Sample image arrays for payment types
const paymentMethodImages = [
  "/images/payments/credit-card.jpg",
  "/images/payments/bank-transfer.jpg",
  "/images/payments/mobile-payment.jpg"
];

const PaymentData = [
  {
    Id: 1,
    eventId: 3, // Summer Music Festival 2025
    organizationId: 2, // Example organization
    totalAmount: 150 * 500, // Ticket price * number of tickets sold
    afriticketPercentage: 0.15, // 15% fee
    amountToBeCollected: 150 * 500 * 0.85, // Amount after Afriticket fee
    paymentMethod: "Credit Card",
    transactionDate: chance.date({ year: 2024 }),
    status: "Processed",
    images: paymentMethodImages,
    deleted: false
  },
  {
    Id: 2,
    fundId: 1, // Emergency Medical Treatment Fund
    organizationId: 1, // Example organization
    totalAmount: 15650, // Total amount raised
    afriticketPercentage: 0.10, // 10% fee
    amountToBeCollected: 15650 * 0.90, // Amount after Afriticket fee
    paymentMethod: "Bank Transfer",
    transactionDate: chance.date({ year: 2024 }),
    status: "Pending",
    images: paymentMethodImages,
    deleted: false
  },
  {
    Id: 3,
    eventId: 7, // Sports Championship Finals
    organizationId: 3, // Example organization
    totalAmount: 200 * 1500, // Ticket price * number of tickets sold
    afriticketPercentage: 0.15, // 15% fee
    amountToBeCollected: 200 * 1500 * 0.85, // Amount after Afriticket fee
    paymentMethod: "Mobile Payment",
    transactionDate: chance.date({ year: 2024 }),
    status: "Processed",
    images: paymentMethodImages,
    deleted: false
  },
  {
    Id: 4,
    fundId: 3, // Disaster Relief Initiative
    organizationId: 4, // Example organization
    totalAmount: 67800, // Total amount raised
    afriticketPercentage: 0.12, // 12% fee
    amountToBeCollected: 67800 * 0.88, // Amount after Afriticket fee
    paymentMethod: "Credit Card",
    transactionDate: chance.date({ year: 2024 }),
    status: "Processed",
    images: paymentMethodImages,
    deleted: false
  },
  {
    Id: 5,
    eventId: 4, // Tech Innovation Conference
    organizationId: 5, // Example organization
    totalAmount: 299 * 800, // Ticket price * number of tickets sold
    afriticketPercentage: 0.15, // 15% fee
    amountToBeCollected: 299 * 800 * 0.85, // Amount after Afriticket fee
    paymentMethod: "Bank Transfer",
    transactionDate: chance.date({ year: 2024 }),
    status: "Pending",
    images: paymentMethodImages,
    deleted: false
  }
];

// Calculate summary statistics
const calculatePaymentSummary = () => {
  return {
    totalCollectedAmount: PaymentData.reduce((sum, payment) => sum + payment.totalAmount, 0),
    totalAcquiredAmount: PaymentData.reduce((sum, payment) => sum + payment.amountToBeCollected, 0),
    amountToBeCollected: PaymentData.filter(payment => payment.status === 'Pending')
      .reduce((sum, payment) => sum + payment.amountToBeCollected, 0)
  };
};

mock.onGet('/api/data/payments/PaymentData').reply(() => {
  return [200, PaymentData];
});

mock.onGet('/api/data/payments/PaymentSummary').reply(() => {
  return [200, calculatePaymentSummary()];
});

export default PaymentData;
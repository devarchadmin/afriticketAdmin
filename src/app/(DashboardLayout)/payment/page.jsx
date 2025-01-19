'use client';
import { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ChildCard from '@/app/components/shared/ChildCard';
import PaymentsFilter from '@/app/components/apps/payment/PaymentsFilter';
import FinancialAreaChart from '@/app/components/charts/ApexArea';
import PaymentsListing from '@/app/components/apps/payment/PaymentsListing';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Paiements',
  },
];

// Initial transaction data
const initialTransactions = [
  {
    id: 1,
    organizationName: "Fondation Médicale Espoir",
    date: new Date('2024-01-15'),
    amount: 75000,
    method: "Virement bancaire",
    status: "Terminé",
    type: "Incoming"
  },
  {
    id: 2,
    organizationName: "Fondation Éducation pour Tous",
    date: new Date('2024-02-20'),
    amount: 50000,
    method: "Paiement en ligne",
    status: "En attente",
    type: "Outgoing"
  },
  {
    id: 3,
    organizationName: "Réseau de Secours Mondial",
    date: new Date('2024-03-10'),
    amount: 100000,
    method: "Chèque",
    status: "Terminé",
    type: "Incoming"
  }
];

const Payments = () => {
  const [transactions, setTransactions] = useState(initialTransactions);

  return (
    <PageContainer title="Paiements | AfrikTicket">
      <Breadcrumb title="Paiements" items={BCrumb} />
      <ChildCard>
      <PaymentsFilter />
      <FinancialAreaChart />
      <PaymentsListing transactions={transactions} />
      </ChildCard>
    </PageContainer>
  );
};

export default Payments;
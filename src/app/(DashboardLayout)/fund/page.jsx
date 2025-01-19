// src/app/(DashboardLayout)/funds/page.js
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import FundsListing from '@/app/components/apps/fund/FundsListing';
import FundsFilter from '@/app/components/apps/fund/FundsFilter';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Fonds',
  },
];

const Funds = () => {
  return (
    <PageContainer title="Fonds | AfrikTicket">
      <Breadcrumb title="Fonds" items={BCrumb} />
      <ChildCard>
        <FundsFilter />
        <FundsListing />
      </ChildCard>
    </PageContainer>
  );
};

export default Funds;
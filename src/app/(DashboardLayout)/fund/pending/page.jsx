import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import PendingFundListing from '@/app/components/apps/fund/PendingFundListing';
import FundsFilter from '@/app/components/apps/fund/FundsFilter';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Fonds en attente',
  },
];

const PendingFunds = () => {
  return (
    <PageContainer title="Fonds en attente | AfrikTicket">
      <Breadcrumb title="Fonds en attente" items={BCrumb} />
      <ChildCard>
        <FundsFilter />
        <PendingFundListing />
      </ChildCard>
    </PageContainer>
  );
};

export default PendingFunds;

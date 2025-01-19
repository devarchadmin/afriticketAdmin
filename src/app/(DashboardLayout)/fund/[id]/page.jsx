'use client'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import FundDetail from '@/app/components/apps/fund/FundDetail';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    to: '/fund',
    title: 'Fonds',
  },
  {
    title: 'Détails du fonds',
  },
];

const FundDetailsPage = ({ params }) => {
  return (
    <PageContainer title="Détails du fonds | AfrikTicket">
      <Breadcrumb title="Détails du fonds" items={BCrumb} />
      <ChildCard>
        <FundDetail params={params} />
      </ChildCard>
    </PageContainer>
  );
};

export default FundDetailsPage;
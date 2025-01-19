import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ClientFilter from '@/app/components/apps/clients/ClientFilter';
import ClientListing from '@/app/components/apps/clients/ClientListing';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Clients',
  },
];

const Clients = () => {
  return (
    <PageContainer title="Clients | AfrikTicket">
      <Breadcrumb title="Gestion des clients" items={BCrumb} />
      <ChildCard>
        <ClientFilter />
        <ClientListing />
      </ChildCard>
    </PageContainer>
  );
};

export default Clients;
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import OrganizationListing from '@/app/components/apps/organizations/OrganizationListing';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Organisations',
  },
];

const Organizations = () => {
  return (
    <PageContainer title="Organisations | AfrikTicket">
      <Breadcrumb title="Organisations" items={BCrumb} />
      <ChildCard>
        <OrganizationListing />
      </ChildCard>
    </PageContainer>
  );
};

export default Organizations;
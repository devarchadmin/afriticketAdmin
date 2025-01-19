import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import EventsFilter from '@/app/components/apps/events/EventsFilter';
import EventsListing from '@/app/components/apps/events/EventsListing';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Événement',
  },
];

const Events = () => {
  return (
    <PageContainer title="Événement | AfrikTicket">
      <Breadcrumb title="Événement" items={BCrumb} />
      <ChildCard>
        <EventsFilter />
        <EventsListing />
      </ChildCard>
    </PageContainer>
  );
};

export default Events;

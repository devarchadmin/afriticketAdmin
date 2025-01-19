import PageContainer from '@/app/components/container/PageContainer'
import Calendar from '@/app/components/apps/calendar/index'
import React from 'react'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Calendrier',
  },
];

const page = () => {
  return (
    <>
      <PageContainer title="Calendrier">
        <Breadcrumb title="Calendrier" items={BCrumb} />
        <Calendar />
      </PageContainer>
    </>
  )
}

export default page

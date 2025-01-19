'use client';
import React, { useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Calendar from '@/app/components/apps/calendar/index';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import BlankCard from '@/app/components/shared/BlankCard';
import FutureEventsCalendar from '@/app/components/apps/calendar/FutureEventsCalendar';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Calendar',
  },
];

const CalendarPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <PageContainer title="Calendar" description="Event Calendar">
      <Breadcrumb title="Calendar" items={BCrumb} />
      
      <BlankCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            aria-label="calendar tabs"
          >
            <Tab label="Regular Calendar" />
            <Tab label="Future Events" />
          </Tabs>
        </Box>

        {currentTab === 0 ? (
          <Calendar />
        ) : (
          <FutureEventsCalendar />
        )}
      </BlankCard>
    </PageContainer>
  );
};

export default CalendarPage;
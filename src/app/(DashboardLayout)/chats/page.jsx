// src/app/(DashboardLayout)/chat/page.js
'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ChatLayout from '@/app/components/apps/chats/ChatLayout';

const BCrumb = [
  {
    to: '/',
    title: 'Maison',
  },
  {
    title: 'Discussions',
  },
];

const ChatPage = () => {
  return (
    <PageContainer title="Discussions | AfrikTickets">
      <Breadcrumb title="Discussions" items={BCrumb} />
      <ChatLayout />
    </PageContainer>
  );
};

export default ChatPage;
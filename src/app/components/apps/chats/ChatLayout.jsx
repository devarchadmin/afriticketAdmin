// src/app/components/apps/chat/ChatLayout.jsx
'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { fetchConversations } from '@/store/apps/chat/ChatSlice';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import BlankCard from '@/app/components/shared/BlankCard';

const ChatLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <BlankCard>
      <Grid container>
        <Grid item xs={12} sm={4} md={3} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
          <ConversationList />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <ChatWindow />
        </Grid>
      </Grid>
    </BlankCard>
  );
};

export default ChatLayout;
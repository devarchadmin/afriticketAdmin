import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { fetchConversation } from '@/store/apps/chat/ChatSlice';
import { format } from 'date-fns';

const ConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.chatReducer.conversations);
  const currentConversation = useSelector(state => state.chatReducer.currentConversation);
  const [searchTerm, setSearchTerm] = useState('');

  const handleConversationClick = (conversationId) => {
    dispatch(fetchConversation(conversationId));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation =>
    conversation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Bar */}
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
          }}
        >
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              '& input': {
                padding: '8px',
                fontSize: '14px',
              },
            }}
            placeholder="Rechercher des contacts"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton 
            type="button" 
            sx={{ 
              p: '8px',
              color: 'text.secondary',
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Recent Chats Label */}
      <Typography
        variant="subtitle2"
        sx={{
          px: 3,
          py: 2,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
       Discussions récentes
      </Typography>

      {/* Conversation List */}
      <List sx={{ 
        flex: 1, 
        overflow: 'auto',
        '& .MuiListItem-root': {
          px: 3,
          py: 1.5,
        }
      }}>
        {filteredConversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            button
            selected={currentConversation?.id === conversation.id}
            onClick={() => handleConversationClick(conversation.id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': { 
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                color="error"
                variant="dot"
                invisible={!conversation.unreadCount}
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    right: 2,
                    top: 2,
                  },
                }}
              >
                <Avatar 
                  src={conversation.clientAvatar} 
                  alt={conversation.clientName}
                  sx={{ width: 40, height: 40 }}
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {conversation.clientName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {conversation.lastMessageTime}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ 
                    maxWidth: '200px',
                    fontSize: '13px',
                    mt: 0.5,
                  }}
                >
                  {conversation.lastMessage}
                </Typography>
              }
              sx={{ my: 0 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ConversationList;
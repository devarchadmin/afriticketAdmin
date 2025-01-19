import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { 
  IconSend, 
  IconPhone, 
  IconVideo, 
  IconDotsVertical 
} from '@tabler/icons-react';
import { sendMessage } from '@/store/apps/chat/ChatSlice';
import { format } from 'date-fns';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const conversation = useSelector(state => state.chatReducer.currentConversation);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && conversation) {
      dispatch(sendMessage(conversation.id, message));
      setMessage('');
    }
  };

  if (!conversation) {
    return (
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary">
        Sélectionnez une conversation pour commencer à discuter
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={conversation.clientAvatar} 
            alt={conversation.clientName}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              {conversation.clientName}
            </Typography>
            <Typography 
              variant="caption" 
              color={conversation.isOnline ? 'success.main' : 'text.secondary'}
              sx={{ 
                display: 'block',
                lineHeight: 1.2,
                mt: 0.5
              }}
            >
              {conversation.isOnline ? 'online' : 'offline'}
            </Typography>
          </Box>
        </Box>
        
        {/* Action Icons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <IconPhone width={20} />
          </IconButton> */}
          {/* <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <IconVideo width={20} />
          </IconButton> */}
          <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <IconDotsVertical width={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          bgcolor: 'grey.50'
        }}
      >
        {conversation.messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.from === 'organizer' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: msg.from === 'organizer' ? 'primary.main' : 'white',
                color: msg.from === 'organizer' ? 'white' : 'text.primary',
                p: 2,
                borderRadius: 2,
                boxShadow: msg.from !== 'organizer' ? 1 : 'none'
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.7,
                  display: 'block',
                  mt: 0.5,
                  textAlign: 'right'
                }}
              >
                {format(new Date(msg.timestamp), 'p')}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <form onSubmit={handleSend}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <IconButton 
              color="primary" 
              type="submit"
              disabled={!message.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled'
                }
              }}
            >
              <IconSend width={20} />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChatWindow;
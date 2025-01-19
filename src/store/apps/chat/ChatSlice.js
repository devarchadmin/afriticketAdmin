// src/store/apps/chat/ChatSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
        state.currentConversation.messages.push(action.payload.message);
        state.currentConversation.lastMessage = action.payload.message.text;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setConversations,
  setCurrentConversation,
  addMessage,
  setLoading,
  setError
} = chatSlice.actions;

export const fetchConversations = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get('/api/chat/conversations');
    dispatch(setConversations(response.data));
  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const fetchConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`/api/chat/conversation/${conversationId}`);
    dispatch(setCurrentConversation(response.data));
  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const sendMessage = (conversationId, message) => async (dispatch) => {
  try {
    const response = await axios.post('/api/chat/send-message', {
      conversationId,
      message
    });
    dispatch(addMessage({
      conversationId,
      message: response.data
    }));
  } catch (err) {
    dispatch(setError(err.message));
  }
};

export default chatSlice.reducer;
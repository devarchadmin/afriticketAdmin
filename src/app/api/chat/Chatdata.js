// src/api/chat/ChatData.js
import mock from '../mock';
import { Chance } from 'chance';
import { sub } from 'date-fns';

const chance = new Chance();

const generateMessage = (fromClient = true, timeOffset = 0, customText = null) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - timeOffset);
  
  return {
    id: chance.guid(),
    text: customText || chance.sentence({ words: chance.integer({ min: 3, max: 15 }) }),
    from: fromClient ? 'client' : 'organizer',
    timestamp: date.toISOString(),
    read: !fromClient,
    clientId: fromClient ? '1' : null,
    organizerId: fromClient ? null : '1'
  };
};

const ChatData = {
  conversations: [
    {
      id: '1',
      clientId: '1',
      clientName: 'John Doe',
      clientAvatar: '/images/profile/user-1.jpg',
      organizerId: '1',
      organizerName: 'Event Organizer',
      organizerAvatar: '/images/profile/user-2.jpg',
      lastMessage: 'When does the event start?',
      unreadCount: 2,
      eventId: 1,
      eventTitle: 'Summer Music Festival 2025',
      messages: [
        generateMessage(true, 50, "Hi, I have a question about the Summer Music Festival"),
        generateMessage(false, 45, "Hello! How can I help you with the festival?"),
        generateMessage(true, 30, "When does the event start?"),
        generateMessage(false, 25, "The festival starts at 2 PM on July 15th, 2025"),
        generateMessage(true, 10, "Great, thanks! Is there parking available?")
      ]
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Sarah Wilson',
      clientAvatar: '/images/profile/user-3.jpg',
      organizerId: '1',
      organizerName: 'Event Organizer',
      organizerAvatar: '/images/profile/user-2.jpg',
      lastMessage: 'Is vegetarian food available?',
      unreadCount: 1,
      eventId: 3,
      eventTitle: 'Food & Wine Festival',
      messages: [
        generateMessage(true, 120, "Hello, I'm interested in the Food & Wine Festival"),
        generateMessage(false, 115, "Welcome! What would you like to know?"),
        generateMessage(true, 110, "Is vegetarian food available?"),
        generateMessage(false, 105, "Yes, we have multiple vegetarian options from various vendors"),
        generateMessage(true, 100, "Perfect! Can I bring my own water bottle?")
      ]
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Mike Johnson',
      clientAvatar: '/images/profile/user-4.jpg',
      organizerId: '1',
      organizerName: 'Event Organizer',
      organizerAvatar: '/images/profile/user-2.jpg',
      lastMessage: 'Can I get a group discount?',
      unreadCount: 0,
      eventId: 2,
      eventTitle: 'Tech Innovation Conference',
      messages: [
        generateMessage(true, 200, "Hi, I'm bringing my tech team to the conference"),
        generateMessage(false, 195, "That's great! How many people are in your team?"),
        generateMessage(true, 190, "We are 15 people. Can I get a group discount?"),
        generateMessage(false, 185, "Yes, groups of 10+ get a 15% discount")
      ]
    },
    {
      id: '4',
      clientId: '4',
      clientName: 'Emily Davis',
      clientAvatar: '/images/profile/user-5.jpg',
      organizerId: '1',
      organizerName: 'Event Organizer',
      organizerAvatar: '/images/profile/user-2.jpg',
      lastMessage: 'Do you have VIP tickets available?',
      unreadCount: 3,
      eventId: 5,
      eventTitle: 'Sports Championship Finals',
      messages: [
        generateMessage(true, 300, "Hello, I'm interested in VIP tickets"),
        generateMessage(false, 295, "Hi Emily! Yes, we still have VIP packages available"),
        generateMessage(true, 290, "What's included in the VIP package?"),
        generateMessage(false, 285, "VIP includes premium seating, lounge access, and meet-and-greet")
      ]
    },
    {
      id: '5',
      clientId: '5',
      clientName: 'David Brown',
      clientAvatar: '/images/profile/user-6.jpg',
      organizerId: '1',
      organizerName: 'Event Organizer',
      organizerAvatar: '/images/profile/user-2.jpg',
      lastMessage: 'What time is the keynote?',
      unreadCount: 1,
      eventId: 7,
      eventTitle: 'Business Leadership Summit',
      messages: [
        generateMessage(true, 400, "Can you tell me about the keynote speaker?"),
        generateMessage(false, 395, "Our keynote speaker is the CEO of Tech Innovations Inc."),
        generateMessage(true, 390, "What time is the keynote?"),
        generateMessage(false, 385, "The keynote starts at 9 AM sharp")
      ]
    }
  ]
};

// API endpoints
mock.onGet('/api/chat/conversations').reply(() => {
  return [200, ChatData.conversations];
});

mock.onGet(/\/api\/chat\/conversation\/\d+/).reply((config) => {
  const conversationId = config.url.split('/').pop();
  const conversation = ChatData.conversations.find(c => c.id === conversationId);
  return conversation ? [200, conversation] : [404];
});

mock.onPost('/api/chat/send-message').reply((config) => {
  const { conversationId, message } = JSON.parse(config.data);
  const conversation = ChatData.conversations.find(c => c.id === conversationId);
  
  if (conversation) {
    const newMessage = {
      id: chance.guid(),
      text: message,
      from: 'organizer',
      timestamp: new Date().toISOString(),
      read: true,
      organizerId: '1'
    };
    conversation.messages.push(newMessage);
    conversation.lastMessage = message;
    return [200, newMessage];
  }
  return [404];
});

// API endpoint to mark messages as read
mock.onPost('/api/chat/mark-as-read').reply((config) => {
  const { conversationId } = JSON.parse(config.data);
  const conversation = ChatData.conversations.find(c => c.id === conversationId);
  
  if (conversation) {
    conversation.messages.forEach(msg => {
      msg.read = true;
    });
    conversation.unreadCount = 0;
    return [200, { success: true }];
  }
  return [404];
});

export default ChatData;
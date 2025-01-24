import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import counterReducer from './counter/counterSlice';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import NotesReducer from './apps/notes/NotesSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/tickets/TicketSlice';
import EventReducer from './apps/events/EventsSlice';
import FundReducer from './apps/fund/FundSlice';
import FundsReducer from './apps/funds/FundsSlice';
import PaymentReducer from './apps/payment/PaymentSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import EcommerceReducer from './apps/eCommerce/EcommerceSlice';
import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import BlogReducer from './apps/blog/BlogSlice';
import OrganizationReducer from './apps/organization/OrganizationSlice';
import ClientReducer from './apps/client/ClientSlice';

const persistConfig = {
  key: 'root',
  storage,
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistReducer(persistConfig, CustomizerReducer),
    ecommerceReducer: EcommerceReducer,
    chatReducer: ChatsReducer,
    emailReducer: EmailReducer,
    notesReducer: NotesReducer,
    contactsReducer: ContactsReducer,
    ticketReducer: TicketReducer,
    eventReducer: EventReducer,
    fundReducer: FundReducer,
    fundsReducer: FundsReducer,
    paymentReducer: PaymentReducer,
    userpostsReducer: UserProfileReducer,
    blogReducer: BlogReducer,
    organizationReducer: OrganizationReducer,
    clientReducer: ClientReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

export const persistor = persistStore(store);

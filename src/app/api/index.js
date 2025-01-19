import mock from './mock';
import './notes/NotesData';
import './chat/Chatdata';
import './email/EmailData';
import './ticket/TicketData';
import './contacts/ContactsData';
import './eCommerce/ProductsData';
import './userprofile/PostData';
import './userprofile/UsersData';
import './blog/blogData';
import './kanban/KanbanData';
import './invoice/invoiceLists';
import './events/EventsData'
import './fund/FundData'
import './payment/PaymentData'

import './organizations/OrganizationData'
import './clients/ClientsData'
mock.onAny().passThrough();

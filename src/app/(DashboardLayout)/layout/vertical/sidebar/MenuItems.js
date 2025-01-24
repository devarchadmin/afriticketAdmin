import { uniqueId } from 'lodash';

import {
  IconCalendar,
  IconTicket,
  IconCurrencyEuro,
  IconMoneybag,
  IconAppWindow,
  IconBuilding,
  IconUser,
  IconLogin,
  IconReload
} from '@tabler/icons-react';
import { IconPasswordMobilePhone } from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Onglets rapides',
  },
  {
    id: uniqueId(),
    title: 'Tableau de bord',
    icon: IconAppWindow,
    href: '/',
  },
  {
    id: uniqueId(),
    title: 'Événements',
    icon: IconTicket,
    href: '/events',
  },
  {
    id: uniqueId(),
    title: 'Fonds',
    icon: IconMoneybag,
    href: '/fund',
  },
  {
    id: uniqueId(),
    title: 'Fonds en attente',
    icon: IconMoneybag,
    href: '/fund/pending',
  },

  {
    id: uniqueId(),
    title: 'Organization',
    icon: IconBuilding,
    href: '/organizations',
  },

  {
    id: uniqueId(),
    title: 'Clients',
    icon: IconUser,
    href: '/clients',
  }, 
  {
    id: uniqueId(),
    title: 'Finance',
    icon: IconCurrencyEuro,
    href: '/payment',
  }, 
  {
    id: uniqueId(),
    title: 'Calendrier',
    icon: IconCalendar,
    href: '/events-calendar',
  },
  {
    id: uniqueId(),
    title: 'Se connecter',
    icon: IconLogin,
    href: '/auth/login',
  },
  {
    id: uniqueId(),
    title: 'Mot de passe oublié',
    icon: IconReload,
    href: 'auth/forgot-password',
  },
];

export default Menuitems;

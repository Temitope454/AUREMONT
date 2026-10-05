import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface SavedSearch {
  id: string;
  title: string;
  city?: string;
  transactionType?: 'Buy' | 'Rent' | 'Lease';
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  alertFrequency: 'instant' | 'daily' | 'weekly' | 'none';
  matchCount: number;
  createdAt: string;
}

export interface RecentlyViewedItem {
  id: string;
  type: 'property' | 'car';
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  pricingCadence?: string;
  image: string;
  slug: string;
  viewedAt: string;
}

export interface MessageItem {
  id: string;
  sender: 'consumer' | 'broker' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ConsumerMessageThread {
  id: string;
  recipientName: string;
  recipientRole: string;
  recipientAgency?: string;
  recipientAvatar?: string;
  subject: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  messages: MessageItem[];
}

export interface ConsumerBooking {
  id: string;
  type: 'property_viewing' | 'mobility_reservation' | 'virtual_tour';
  itemTitle: string;
  itemSubtitle: string;
  itemImage: string;
  referenceId: string; // property or vehicle ID
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  format: 'In-Person Accompanied' | 'Virtual 3D Walkthrough' | 'Chauffeur Delivery' | 'Self-Pickup';
  agentName: string;
  agentPhone: string;
  status: 'Confirmed' | 'Pending Confirmation' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface ConsumerNotification {
  id: string;
  category: 'price_drop' | 'viewing_update' | 'concierge_recommendation' | 'security_alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ConsumerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  preferredCity: string;
  investmentHorizon: string;
  acquisitionBudget: string;
  buyerType: 'Residential Buyer' | 'Tenant' | 'Commercial' | string;
  membershipTier?: string;
  memberId?: string;
}

export interface ConsumerSecurity {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'authenticator_app' | 'sms' | 'hardware_key';
  emailAlertsOnLogin: boolean;
  biometricActive: boolean;
  activeSessionsCount: number;
}

interface ConsumerContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  savedSearches: SavedSearch[];
  addSavedSearch: (search: Omit<SavedSearch, 'id' | 'createdAt' | 'matchCount'>) => void;
  removeSavedSearch: (id: string) => void;
  toggleSearchAlert: (id: string, frequency: SavedSearch['alertFrequency']) => void;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clearRecentlyViewed: () => void;
  removeRecentlyViewed: (id: string) => void;
  messageThreads: ConsumerMessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  createInquiryThread: (params: {
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    agentName: string;
    agentAgency?: string;
    message: string;
  }) => string;
  bookings: ConsumerBooking[];
  createBooking: (booking: Omit<ConsumerBooking, 'id' | 'status' | 'createdAt'>) => string;
  cancelBooking: (id: string, reason?: string) => void;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => void;
  notifications: ConsumerNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  profile: ConsumerProfile;
  updateProfile: (updates: Partial<ConsumerProfile>) => void;
  security: ConsumerSecurity;
  updateSecurity: (updates: Partial<ConsumerSecurity>) => void;
}

const defaultSavedSearches: SavedSearch[] = [
  {
    id: 'ss-101',
    title: 'Paris 7th & 8th Penthouses',
    city: 'Paris',
    transactionType: 'Buy',
    propertyType: 'Apartment',
    minPrice: 2000000,
    maxPrice: 8000000,
    beds: 3,
    alertFrequency: 'daily',
    matchCount: 4,
    createdAt: '2026-09-15',
  },
  {
    id: 'ss-102',
    title: 'London Mayfair & Belgravia Freehold',
    city: 'London',
    transactionType: 'Buy',
    propertyType: 'House',
    beds: 4,
    alertFrequency: 'instant',
    matchCount: 6,
    createdAt: '2026-09-22',
  },
  {
    id: 'ss-103',
    title: 'Dubai Marina & Palm Waterfront Villas',
    city: 'Dubai',
    transactionType: 'Buy',
    propertyType: 'Villa',
    alertFrequency: 'weekly',
    matchCount: 3,
    createdAt: '2026-09-28',
  },
];

const defaultRecentlyViewed: RecentlyViewedItem[] = [
  {
    id: 'p-1001',
    type: 'property',
    title: 'Rue de Varenne Residence',
    subtitle: '7th arrondissement, Paris',
    price: 2850000,
    currency: '€',
    image: '/images/paris_apartment.jpg',
    slug: 'rue-de-varenne-residence-paris',
    viewedAt: '2 hours ago',
  },
  {
    id: 'v-2001',
    type: 'car',
    title: 'Range Rover Velar',
    subtitle: 'Paris Hub · Hybrid Powertrain',
    price: 320,
    currency: '€',
    pricingCadence: '/ day',
    image: '/images/car1.jpg',
    slug: 'range-rover-velar-paris',
    viewedAt: '5 hours ago',
  },
  {
    id: 'p-1002',
    type: 'property',
    title: 'Mayfair Garden Flat',
    subtitle: 'Mayfair, London',
    price: 3400000,
    currency: '£',
    image: '/images/london_apartment.jpg',
    slug: 'mayfair-garden-flat-london',
    viewedAt: 'Yesterday',
  },
];

const defaultMessageThreads: ConsumerMessageThread[] = [
  {
    id: 'thread-01',
    recipientName: 'Claire Moreau',
    recipientRole: 'Senior Partner',
    recipientAgency: 'Barnes International Paris',
    recipientAvatar: '/images/paris_apartment.jpg',
    subject: 'Private Viewing — Rue de Varenne Residence',
    propertyId: 'p-1001',
    propertyTitle: 'Rue de Varenne Residence',
    propertyImage: '/images/paris_apartment.jpg',
    lastMessage: 'I have arranged private access with the concierge for Thursday at 15:00 CET.',
    updatedAt: '10:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        sender: 'consumer',
        senderName: 'You',
        text: 'Bonjour Madame Moreau. I am interested in scheduling an in-person viewing of the Rue de Varenne property this week.',
        timestamp: 'Yesterday, 16:30',
      },
      {
        id: 'msg-2',
        sender: 'broker',
        senderName: 'Claire Moreau',
        text: 'Good afternoon. It would be my absolute pleasure. The owners have authorized accompanied private viewings. Would Thursday at 15:00 CET suit your schedule?',
        timestamp: 'Today, 09:15',
      },
      {
        id: 'msg-3',
        sender: 'consumer',
        senderName: 'You',
        text: 'Thursday at 15:00 CET works perfectly. My private driver will drop me off at the main courtyard gate.',
        timestamp: 'Today, 10:12',
      },
      {
        id: 'msg-4',
        sender: 'broker',
        senderName: 'Claire Moreau',
        text: 'I have arranged private access with the concierge for Thursday at 15:00 CET. Looking forward to welcoming you.',
        timestamp: 'Today, 10:45',
      },
    ],
  },
  {
    id: 'thread-02',
    recipientName: 'Julian Vance',
    recipientRole: 'Director of Prime Central',
    recipientAgency: 'Knight Frank Mayfair',
    recipientAvatar: '/images/london_apartment.jpg',
    subject: 'Tenancy Application — Mayfair Garden Flat',
    propertyId: 'p-1002',
    propertyTitle: 'Mayfair Garden Flat',
    propertyImage: '/images/london_apartment.jpg',
    lastMessage: 'The inventory schedule and draft AST agreement have been forwarded to your counsel.',
    updatedAt: 'Oct 3',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-201',
        sender: 'consumer',
        senderName: 'You',
        text: 'Julian, we have completed the initial deposit. Please send the inventory and tenancy draft.',
        timestamp: 'Oct 2, 11:20',
      },
      {
        id: 'msg-202',
        sender: 'broker',
        senderName: 'Julian Vance',
        text: 'The inventory schedule and draft AST agreement have been forwarded to your counsel.',
        timestamp: 'Oct 3, 14:05',
      },
    ],
  },
];

const defaultBookings: ConsumerBooking[] = [
  {
    id: 'bk-501',
    type: 'property_viewing',
    itemTitle: 'Rue de Varenne Residence',
    itemSubtitle: '7th arrondissement, Paris',
    itemImage: '/images/paris_apartment.jpg',
    referenceId: 'p-1001',
    scheduledDate: '2026-10-08',
    scheduledTime: '15:00',
    format: 'In-Person Accompanied',
    agentName: 'Claire Moreau (Barnes International)',
    agentPhone: '+33 1 42 68 55 00',
    status: 'Confirmed',
    notes: 'Private access through inner courtyard. Concierge notified of scheduled arrival.',
    createdAt: '2026-10-02',
  },
  {
    id: 'bk-502',
    type: 'mobility_reservation',
    itemTitle: 'Range Rover Velar Hybrid',
    itemSubtitle: 'Auremont Mobility Paris Hub',
    itemImage: '/images/car1.jpg',
    referenceId: 'v-2001',
    scheduledDate: '2026-10-12',
    scheduledTime: '10:00',
    format: 'Chauffeur Delivery',
    agentName: 'Auremont Fleet Logistics',
    agentPhone: '+33 1 70 80 90 00',
    status: 'Confirmed',
    notes: 'Direct terminal handover at Le Bourget Airport.',
    createdAt: '2026-10-03',
  },
  {
    id: 'bk-503',
    type: 'virtual_tour',
    itemTitle: 'Villa Bellissima Brera',
    itemSubtitle: 'Brera Art District, Milan',
    itemImage: '/images/madrid_apartment.jpg',
    referenceId: 'p-1004',
    scheduledDate: '2026-10-15',
    scheduledTime: '16:30',
    format: 'Virtual 3D Walkthrough',
    agentName: 'Matteo Rossi (Sotheby’s Milan)',
    agentPhone: '+39 02 876 5432',
    status: 'Pending Confirmation',
    notes: 'Architectural walkthrough hosted via video call.',
    createdAt: '2026-10-04',
  },
];

const defaultNotifications: ConsumerNotification[] = [
  {
    id: 'notif-1',
    category: 'viewing_update',
    title: 'Viewing Confirmed',
    message: 'Your private accompanied viewing for Rue de Varenne Residence is confirmed for Thursday at 15:00 CET.',
    timestamp: '1 hour ago',
    read: false,
    link: '/account/bookings',
  },
  {
    id: 'notif-2',
    category: 'concierge_recommendation',
    title: 'Auremont Concierge Suggestion',
    message: 'A rare penthouse overlooking Hyde Park has just been privately listed matching your criteria.',
    timestamp: '5 hours ago',
    read: false,
    link: '/search',
  },
  {
    id: 'notif-3',
    category: 'price_drop',
    title: 'Price Adjustment on Saved Property',
    message: 'Mayfair Garden Flat has been adjusted by £150,000 to £3,400,000.',
    timestamp: 'Yesterday',
    read: true,
    link: '/property/p-1002',
  },
  {
    id: 'notif-4',
    category: 'security_alert',
    title: 'New Sign-in Detected',
    message: 'A new session was detected from Paris, France (Browser: Chrome on MacOS).',
    timestamp: '3 days ago',
    read: true,
    link: '/account/settings',
  },
];

const defaultProfile: ConsumerProfile = {
  firstName: 'Marcus',
  lastName: 'Alvarez',
  email: 'marcus.alvarez@example.com',
  phone: '+33 1 42 68 55 00',
  nationality: 'French',
  preferredCity: 'Paris',
  investmentHorizon: 'Seeking prime central residential apartment with terrace or garden.',
  acquisitionBudget: '€2,000,000 – €5,000,000',
  buyerType: 'Residential Buyer',
  membershipTier: 'Client Account',
  memberId: 'AU-20491',
};

const defaultSecurity: ConsumerSecurity = {
  twoFactorEnabled: false,
  twoFactorMethod: 'authenticator_app',
  emailAlertsOnLogin: true,
  biometricActive: false,
  activeSessionsCount: 1,
};

const ConsumerContext = createContext<ConsumerContextType | undefined>(undefined);

export function ConsumerProvider({ children }: { children: ReactNode }) {
  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('auremont_favorites');
    return saved ? JSON.parse(saved) : ['p-1001', 'p-1002', 'v-2001'];
  });

  // Saved Searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('auremont_saved_searches');
    return saved ? JSON.parse(saved) : defaultSavedSearches;
  });

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() => {
    const saved = localStorage.getItem('auremont_recently_viewed');
    return saved ? JSON.parse(saved) : defaultRecentlyViewed;
  });

  // Message Threads
  const [messageThreads, setMessageThreads] = useState<ConsumerMessageThread[]>(() => {
    const saved = localStorage.getItem('auremont_consumer_messages');
    return saved ? JSON.parse(saved) : defaultMessageThreads;
  });

  // Bookings & Viewings
  const [bookings, setBookings] = useState<ConsumerBooking[]>(() => {
    const saved = localStorage.getItem('auremont_consumer_bookings');
    return saved ? JSON.parse(saved) : defaultBookings;
  });

  // Notifications
  const [notifications, setNotifications] = useState<ConsumerNotification[]>(() => {
    const saved = localStorage.getItem('auremont_consumer_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  // Profile
  const [profile, setProfile] = useState<ConsumerProfile>(() => {
    const saved = localStorage.getItem('auremont_consumer_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  // Security
  const [security, setSecurity] = useState<ConsumerSecurity>(() => {
    const saved = localStorage.getItem('auremont_consumer_security');
    return saved ? JSON.parse(saved) : defaultSecurity;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('auremont_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('auremont_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    localStorage.setItem('auremont_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('auremont_consumer_messages', JSON.stringify(messageThreads));
  }, [messageThreads]);

  useEffect(() => {
    localStorage.setItem('auremont_consumer_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('auremont_consumer_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('auremont_consumer_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('auremont_consumer_security', JSON.stringify(security));
  }, [security]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addSavedSearch = (searchData: Omit<SavedSearch, 'id' | 'createdAt' | 'matchCount'>) => {
    const newSearch: SavedSearch = {
      ...searchData,
      id: `ss-${Date.now()}`,
      matchCount: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSavedSearches(prev => [newSearch, ...prev]);
  };

  const removeSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const toggleSearchAlert = (id: string, frequency: SavedSearch['alertFrequency']) => {
    setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, alertFrequency: frequency } : s));
  };

  const addRecentlyViewed = (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== item.id);
      return [{ ...item, viewedAt: 'Just now' }, ...filtered.slice(0, 9)];
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const removeRecentlyViewed = (id: string) => {
    setRecentlyViewed(prev => prev.filter(p => p.id !== id));
  };

  const sendMessage = (threadId: string, text: string) => {
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'consumer',
      senderName: 'You',
      text,
      timestamp: 'Just now',
    };

    setMessageThreads(prev => prev.map(th => {
      if (th.id !== threadId) return th;
      return {
        ...th,
        lastMessage: text,
        updatedAt: 'Just now',
        messages: [...th.messages, newMsg],
      };
    }));

    // Simulate an institutional broker reply after a brief realistic delay
    setTimeout(() => {
      const brokerReply: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        sender: 'broker',
        senderName: 'Auremont Prime Associate',
        text: 'Thank you for your note. Our private client team has received this and will coordinate all dossier elements shortly.',
        timestamp: 'Just now',
      };
      setMessageThreads(prev => prev.map(th => {
        if (th.id !== threadId) return th;
        return {
          ...th,
          lastMessage: brokerReply.text,
          updatedAt: 'Just now',
          messages: [...th.messages, brokerReply],
        };
      }));
    }, 2500);
  };

  const createInquiryThread = (params: {
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    agentName: string;
    agentAgency?: string;
    message: string;
  }) => {
    const threadId = `thread-${Date.now()}`;
    const newThread: ConsumerMessageThread = {
      id: threadId,
      recipientName: params.agentName,
      recipientRole: 'Senior Representative',
      recipientAgency: params.agentAgency || 'Auremont Partner Agency',
      recipientAvatar: params.propertyImage,
      subject: `Inquiry — ${params.propertyTitle}`,
      propertyId: params.propertyId,
      propertyTitle: params.propertyTitle,
      propertyImage: params.propertyImage,
      lastMessage: params.message,
      updatedAt: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'consumer',
          senderName: 'You',
          text: params.message,
          timestamp: 'Just now',
        },
      ],
    };

    setMessageThreads(prev => [newThread, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        category: 'viewing_update',
        title: 'Inquiry Dispatched',
        message: `Your inquiry regarding ${params.propertyTitle} was forwarded to ${params.agentName}.`,
        timestamp: 'Just now',
        read: false,
        link: '/account/messages',
      },
      ...prev,
    ]);

    return threadId;
  };

  const createBooking = (bookingData: Omit<ConsumerBooking, 'id' | 'status' | 'createdAt'>) => {
    const bookingId = `bk-${Date.now()}`;
    const newBooking: ConsumerBooking = {
      ...bookingData,
      id: bookingId,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [newBooking, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        category: 'viewing_update',
        title: 'Appointment Scheduled',
        message: `Private appointment for ${bookingData.itemTitle} has been recorded for ${bookingData.scheduledDate} at ${bookingData.scheduledTime}.`,
        timestamp: 'Just now',
        read: false,
        link: '/account/bookings',
      },
      ...prev,
    ]);

    return bookingId;
  };

  const cancelBooking = (id: string, reason?: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled', notes: reason ? `Cancelled: ${reason}` : b.notes } : b));
  };

  const rescheduleBooking = (id: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, scheduledDate: newDate, scheduledTime: newTime, status: 'Confirmed' } : b));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateProfile = (updates: Partial<ConsumerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSecurity = (updates: Partial<ConsumerSecurity>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
  };

  return (
    <ConsumerContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        savedSearches,
        addSavedSearch,
        removeSavedSearch,
        toggleSearchAlert,
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        removeRecentlyViewed,
        messageThreads,
        sendMessage,
        createInquiryThread,
        bookings,
        createBooking,
        cancelBooking,
        rescheduleBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        profile,
        updateProfile,
        security,
        updateSecurity,
      }}
    >
      {children}
    </ConsumerContext.Provider>
  );
}

export function useConsumerState() {
  const context = useContext(ConsumerContext);
  if (context === undefined) {
    throw new Error('useConsumerState must be used within a ConsumerProvider');
  }
  return context;
}

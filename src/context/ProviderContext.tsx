import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { calculateCommission as calcCommission } from '../utils/commission';
import type { TransactionType, CommissionResult } from '../utils/commission';

export interface Lead {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  propertyTitle: string;
  date: string;
  status: 'new' | 'contacted' | 'viewing_requested' | 'closed';
  message: string;
  budget?: string;
  preferredMoveIn?: string;
}

export interface Request {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  propertyTitle: string;
  dates: string;
  status: 'pending' | 'approved' | 'declined';
  message: string;
  occupants?: number;
  employmentStatus?: string;
}

export interface ProviderViewing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: 'requested' | 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ProviderTransaction {
  id: string;
  reference: string;
  propertyTitle: string;
  customerName: string;
  type: TransactionType;
  grossAmount: number;
  currency: string;
  commissionRate?: number;
  commissionAmount?: number;
  netAmount?: number;
  isConfigured: boolean;
  commissionMessage?: string;
  paymentMethod?: string;
  status: 'pending' | 'completed';
  date: string;
}

export interface ProviderProperty {
  id: string;
  title: string;
  location: string;
  type: 'sale' | 'rent' | 'lease';
  propertyType?: string;
  price: number;
  currency: string;
  pricingCadence?: string;
  status: 'draft' | 'under_review' | 'published' | 'paused' | 'archived';
  availability: 'available' | 'unavailable' | 'under_offer';
  mainImage: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  interiorSize?: number;
  sizeUnit?: string;
  furnishedState?: string;
  description?: string;
  amenities?: string[];
  lastUpdated: string;
}

export interface ProviderMessageItem {
  id: string;
  sender: 'provider' | 'customer';
  text: string;
  timestamp: string;
}

export interface ProviderConversation {
  id: number;
  customer: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ProviderMessageItem[];
}

export interface ProviderNotification {
  id: number;
  title: string;
  body: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  link?: string;
}

interface ProviderState {
  properties: ProviderProperty[];
  leads: Lead[];
  requests: Request[];
  viewings: ProviderViewing[];
  transactions: ProviderTransaction[];
  conversations: ProviderConversation[];
  notifications: ProviderNotification[];
  calculateCommission: (gross: number, type: TransactionType) => CommissionResult;
  addProperty: (prop: ProviderProperty) => void;
  updateProperty: (id: string, updates: Partial<ProviderProperty>) => void;
  updatePropertyStatus: (id: string, status: ProviderProperty['status']) => void;
  duplicateProperty: (id: string) => ProviderProperty | null;
  archiveProperty: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  updateRequestStatus: (id: string, status: Request['status']) => void;
  updateViewingStatus: (id: string, status: ProviderViewing['status'], newDate?: string, newTime?: string) => void;
  sendMessage: (convId: number, text: string) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
}

const ProviderContext = createContext<ProviderState | undefined>(undefined);

// Initial Mock Data
const INITIAL_PROPERTIES: ProviderProperty[] = [
  {
    id: 'prop_p1',
    title: 'Modern Minimalist Apartment',
    location: 'Barcelona, Spain',
    type: 'rent',
    propertyType: 'apartment',
    price: 2500,
    currency: '€',
    pricingCadence: 'monthly',
    status: 'published',
    availability: 'available',
    mainImage: '/images/madrid_apartment.jpg',
    images: ['/images/madrid_apartment.jpg', '/images/paris_apartment.jpg'],
    bedrooms: 2,
    bathrooms: 2,
    interiorSize: 110,
    sizeUnit: 'sqm',
    furnishedState: 'furnished',
    description: 'Bespoke apartment featuring expansive floor-to-ceiling windows and premium finishes.',
    amenities: ['Air Conditioning', 'Elevator', 'Terrace'],
    lastUpdated: 'Oct 15, 2026'
  },
  {
    id: 'prop_p2',
    title: 'Restored Heritage Villa',
    location: 'Lake Como, Italy',
    type: 'sale',
    propertyType: 'villa',
    price: 3400000,
    currency: '€',
    status: 'under_review',
    availability: 'available',
    mainImage: '/images/milan_apartment.jpg',
    images: ['/images/milan_apartment.jpg', '/images/lisbon_house.jpg'],
    bedrooms: 5,
    bathrooms: 6,
    interiorSize: 450,
    sizeUnit: 'sqm',
    furnishedState: 'partially',
    description: 'Historic lakeside estate featuring landscaped Italian gardens and private boat slip.',
    amenities: ['View', 'Pool', 'Parking', 'Concierge'],
    lastUpdated: 'Oct 14, 2026'
  },
  {
    id: 'prop_p3',
    title: 'Mayfair Mews House',
    location: 'London, United Kingdom',
    type: 'sale',
    propertyType: 'house',
    price: 2800000,
    currency: '£',
    status: 'published',
    availability: 'available',
    mainImage: '/images/london_apartment.jpg',
    images: ['/images/london_apartment.jpg'],
    bedrooms: 3,
    bathrooms: 3,
    interiorSize: 220,
    sizeUnit: 'sqm',
    furnishedState: 'unfurnished',
    description: 'Immaculately proportioned classic London mews house with private garage.',
    amenities: ['Parking', 'Terrace'],
    lastUpdated: 'Oct 12, 2026'
  }
];

const INITIAL_LEADS: Lead[] = [
  { 
    id: 'ld_1', 
    customerName: 'Eleanor Vance', 
    customerEmail: 'eleanor.vance@example.com',
    customerPhone: '+33 6 12 34 56 78',
    propertyTitle: 'Paris Apartment', 
    date: 'Oct 12, 2026', 
    status: 'new', 
    message: 'I am interested in arranging a private viewing this Saturday afternoon.',
    budget: '€1,500,000',
    preferredMoveIn: 'Immediate'
  },
  { 
    id: 'ld_2', 
    customerName: 'David Chen', 
    customerEmail: 'd.chen@singapore-invest.sg',
    customerPhone: '+65 9123 4567',
    propertyTitle: 'Mayfair Mews House', 
    date: 'Oct 10, 2026', 
    status: 'contacted', 
    message: 'Could you kindly send through the architectural CAD floor plans and leasehold details?',
    budget: '£3,000,000'
  }
];

const INITIAL_REQUESTS: Request[] = [
  { 
    id: 'rq_1', 
    customerName: 'Sophie Laurent', 
    customerEmail: 'sophie.laurent@lyon-design.fr',
    customerPhone: '+33 6 98 76 54 32',
    propertyTitle: 'Modern Minimalist Apartment', 
    dates: 'Nov 1 - Nov 30, 2026', 
    status: 'pending', 
    message: 'Looking for a one-month corporate stay while our architectural studio relocates.',
    occupants: 2,
    employmentStatus: 'Employed (Director)'
  },
  { 
    id: 'rq_2', 
    customerName: 'Alexander Hayes', 
    customerEmail: 'alex.hayes@tech-ventures.co.uk',
    customerPhone: '+44 7700 900123',
    propertyTitle: 'Modern Minimalist Apartment', 
    dates: 'Dec 15, 2026 - Jan 15, 2027', 
    status: 'pending', 
    message: 'Family winter vacation stay. Respectful tenants with verified references.',
    occupants: 3,
    employmentStatus: 'Self-employed'
  }
];

const INITIAL_VIEWINGS: ProviderViewing[] = [
  {
    id: 'vw_1',
    propertyId: 'prop_p1',
    propertyTitle: 'Modern Minimalist Apartment',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@example.com',
    customerPhone: '+33 6 12 34 56 78',
    date: 'Oct 18, 2026',
    timeSlot: '14:30 - 15:15',
    status: 'requested',
    notes: 'Client flying in from Geneva. Interested in viewing natural light.'
  },
  {
    id: 'vw_2',
    propertyId: 'prop_p2',
    propertyTitle: 'Restored Heritage Villa',
    customerName: 'Marcus Sterling',
    customerEmail: 'marcus@sterling-holdings.com',
    customerPhone: '+44 20 7946 0912',
    date: 'Oct 22, 2026',
    timeSlot: '11:00 - 12:30',
    status: 'upcoming',
    notes: 'Private boat arrival requested at villa dock.'
  },
  {
    id: 'vw_3',
    propertyId: 'prop_p3',
    propertyTitle: 'Mayfair Mews House',
    customerName: 'David Chen',
    customerEmail: 'd.chen@singapore-invest.sg',
    customerPhone: '+65 9123 4567',
    date: 'Oct 05, 2026',
    timeSlot: '16:00 - 16:45',
    status: 'completed',
    notes: 'Viewing completed. Client requested survey documentation.'
  }
];

const RAW_INITIAL_TRANSACTIONS = [
  {
    id: 'tx_prov_1',
    reference: 'TX-89A4B2',
    propertyTitle: 'Alfama Courtyard House',
    customerName: 'James Wilson',
    type: 'rent' as TransactionType,
    grossAmount: 4800,
    currency: '€',
    paymentMethod: 'Bank Wire (SEPA)',
    status: 'completed' as const,
    date: 'Oct 10, 2026'
  },
  {
    id: 'tx_prov_2',
    reference: 'TX-11B3C9',
    propertyTitle: 'Madrid Apartment',
    customerName: 'Elena Rostova',
    type: 'sale' as TransactionType,
    grossAmount: 1250000,
    currency: '€',
    paymentMethod: 'Escrow Account',
    status: 'pending' as const,
    date: 'Oct 15, 2026'
  },
  {
    id: 'tx_prov_3',
    reference: 'TX-44D9E2',
    propertyTitle: 'Mayfair Mews House',
    customerName: 'Arthur Kensington',
    type: 'sale' as TransactionType,
    grossAmount: 2800000,
    currency: '£',
    paymentMethod: 'UK Client Solicitor Escrow',
    status: 'completed' as const,
    date: 'Sep 28, 2026'
  },
  {
    id: 'tx_prov_4',
    reference: 'TX-72F8A1',
    propertyTitle: 'Tribeca Loft',
    customerName: 'Claire Vanderbilt',
    type: 'rent' as TransactionType,
    grossAmount: 12000,
    currency: '$',
    paymentMethod: 'ACH Direct',
    status: 'completed' as const,
    date: 'Sep 15, 2026'
  },
  {
    id: 'tx_prov_5',
    reference: 'TX-95G2H3',
    propertyTitle: 'Downtown Luxury Residence',
    customerName: 'Tariq Al-Mansoor',
    type: 'rent' as TransactionType,
    grossAmount: 180000,
    currency: 'AED',
    paymentMethod: 'UAE Central Bank Wire',
    status: 'pending' as const,
    date: 'Oct 02, 2026'
  },
  {
    id: 'tx_prov_6',
    reference: 'TX-33J7K4',
    propertyTitle: 'Marina Bay Penthouse',
    customerName: 'Li Wei Investment Ltd',
    type: 'sale' as TransactionType,
    grossAmount: 4500000,
    currency: 'S$',
    paymentMethod: 'DBS Singapore Escrow',
    status: 'completed' as const,
    date: 'Aug 20, 2026'
  },
  {
    id: 'tx_prov_7',
    reference: 'TX-61L5M9',
    propertyTitle: 'Boulevard Haussmann Commercial Space',
    customerName: 'Atelier Mode SAS',
    type: 'lease' as TransactionType,
    grossAmount: 25000,
    currency: '€',
    paymentMethod: 'Bilateral Commercial Lease',
    status: 'pending' as const,
    date: 'Oct 11, 2026'
  }
];

const INITIAL_CONVERSATIONS: ProviderConversation[] = [
  {
    id: 1,
    customer: 'Eleanor Vance',
    property: 'Paris Apartment',
    lastMessage: 'Is it possible to view the property this Saturday afternoon?',
    time: '2 hours ago',
    unread: true,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Good morning, I reviewed the photos of the Paris apartment.', timestamp: '10:15 AM' },
      { id: 'm2', sender: 'provider', text: 'Good morning Eleanor. Thank you for your inquiry! We can arrange a private showing.', timestamp: '10:30 AM' },
      { id: 'm3', sender: 'customer', text: 'Is it possible to view the property this Saturday afternoon?', timestamp: '11:45 AM' }
    ]
  },
  {
    id: 2,
    customer: 'James Wilson',
    property: 'Alfama Courtyard House',
    lastMessage: 'Thanks, the lease documentation looks completely in order.',
    time: 'Yesterday',
    unread: false,
    messages: [
      { id: 'm4', sender: 'provider', text: 'Hi James, attaching the draft rental contract for your review.', timestamp: 'Yesterday 2:00 PM' },
      { id: 'm5', sender: 'customer', text: 'Thanks, the lease documentation looks completely in order.', timestamp: 'Yesterday 4:15 PM' }
    ]
  }
];

const INITIAL_NOTIFICATIONS: ProviderNotification[] = [
  { id: 1, title: 'Listing Approved', body: 'Your listing "Modern Minimalist Apartment" has passed review and is now published.', time: '2 hours ago', type: 'success', read: false, link: '/provider/properties' },
  { id: 2, title: 'New Buyer Inquiry', body: 'Eleanor Vance submitted an inquiry regarding "Paris Apartment".', time: '5 hours ago', type: 'info', read: false, link: '/provider/leads' },
  { id: 3, title: 'Rental Request Received', body: 'Sophie Laurent requested booking for Modern Minimalist Apartment (Nov 1 - Nov 30).', time: '1 day ago', type: 'warning', read: true, link: '/provider/requests' },
  { id: 4, title: 'Identity Documentation Under Review', body: 'Your submitted passport ID is being processed by Auremont Compliance.', time: '2 days ago', type: 'info', read: true, link: '/provider/verification' }
];

export function ProviderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAgent = user?.providerRole === 'agent';

  // LocalStorage-backed state
  const [properties, setProperties] = useState<ProviderProperty[]>(() => {
    const saved = localStorage.getItem('auremont_provider_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('auremont_provider_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [requests, setRequests] = useState<Request[]>(() => {
    const saved = localStorage.getItem('auremont_provider_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [viewings, setViewings] = useState<ProviderViewing[]>(() => {
    const saved = localStorage.getItem('auremont_provider_viewings');
    return saved ? JSON.parse(saved) : INITIAL_VIEWINGS;
  });

  const [conversations, setConversations] = useState<ProviderConversation[]>(() => {
    const saved = localStorage.getItem('auremont_provider_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState<ProviderNotification[]>(() => {
    const saved = localStorage.getItem('auremont_provider_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Calculate transactions with safe centralized commission calculation
  const transactions: ProviderTransaction[] = RAW_INITIAL_TRANSACTIONS.map(tx => {
    const { isConfigured, rate, commission, net, message } = calcCommission(tx.grossAmount, tx.type);
    return {
      ...tx,
      isConfigured,
      commissionRate: rate,
      commissionAmount: commission,
      netAmount: net,
      commissionMessage: message,
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('auremont_provider_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('auremont_provider_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('auremont_provider_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('auremont_provider_viewings', JSON.stringify(viewings));
  }, [viewings]);

  useEffect(() => {
    localStorage.setItem('auremont_provider_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('auremont_provider_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Mutations
  const addProperty = (prop: ProviderProperty) => {
    setProperties(prev => [prop, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<ProviderProperty>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: 'Just now' } : p));
  };

  const updatePropertyStatus = (id: string, status: ProviderProperty['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status, lastUpdated: 'Just now' } : p));
  };

  const duplicateProperty = (id: string): ProviderProperty | null => {
    const original = properties.find(p => p.id === id);
    if (!original) return null;
    const duplicated: ProviderProperty = {
      ...original,
      id: `prop_${Date.now()}`,
      title: `${original.title} (Draft Copy)`,
      status: 'draft',
      lastUpdated: 'Just now'
    };
    setProperties(prev => [duplicated, ...prev]);
    return duplicated;
  };

  const archiveProperty = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'archived', lastUpdated: 'Just now' } : p));
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const updateRequestStatus = (id: string, status: Request['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const updateViewingStatus = (id: string, status: ProviderViewing['status'], newDate?: string, newTime?: string) => {
    setViewings(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status,
          date: newDate || v.date,
          timeSlot: newTime || v.timeSlot
        };
      }
      return v;
    }));
  };

  const sendMessage = (convId: number, text: string) => {
    const newMsg: ProviderMessageItem = {
      id: `m_${Date.now()}`,
      sender: 'provider',
      text,
      timestamp: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          lastMessage: text,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filter based on active role if desired, but retain raw access
  const visibleLeads = isAgent ? leads : [];
  const visibleRequests = !isAgent ? requests : [];

  return (
    <ProviderContext.Provider value={{
      properties,
      leads: visibleLeads,
      requests: visibleRequests,
      viewings,
      transactions,
      conversations,
      notifications,
      calculateCommission: calcCommission,
      addProperty,
      updateProperty,
      updatePropertyStatus,
      duplicateProperty,
      archiveProperty,
      updateLeadStatus,
      updateRequestStatus,
      updateViewingStatus,
      sendMessage,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviderState() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProviderState must be used within a ProviderProvider');
  }
  return context;
}
